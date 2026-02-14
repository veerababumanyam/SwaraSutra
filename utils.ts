
import { GoogleGenAI } from "@google/genai";
import { GeneratedLyrics } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  RATE_LIMIT_RPM,
  RATE_LIMIT_CONCURRENCY,
  MIN_INTER_CALL_DELAY_MS,
  RETRY_BASE_DELAY_MS,
  RETRY_MAX_ATTEMPTS,
  RETRY_JITTER_FACTOR,
  RATE_LIMIT_RPM_PRO,
  RATE_LIMIT_RPM_FLASH,
  MIN_INTER_CALL_DELAY_PRO_MS,
  MIN_INTER_CALL_DELAY_FLASH_MS,
  RETRY_MAX_ATTEMPTS_PRO
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GeminiErrorType = 'AUTH' | 'QUOTA' | 'SERVER' | 'NETWORK' | 'SAFETY' | 'PARSING' | 'UNKNOWN';

export class GeminiError extends Error {
  constructor(
    message: string,
    public type: GeminiErrorType,
    public originalError?: any
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

export const getSafeLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    let parsed: any;
    try {
      parsed = JSON.parse(item);
    } catch (parseErr) {
      return defaultValue;
    }

    if (Array.isArray(defaultValue)) {
      return Array.isArray(parsed) ? (parsed as unknown as T) : defaultValue;
    }

    if (typeof defaultValue === 'object' && defaultValue !== null) {
      return (typeof parsed === 'object' && parsed !== null) ? (parsed as unknown as T) : defaultValue;
    }

    return parsed as T;
  } catch (error) {
    return defaultValue;
  }
};

export const setSafeLocalStorage = (key: string, value: any) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`swarasutra Storage: Write Error:`, error);
  }
};

/**
 * Checks if a string looks like a valid Gemini API key.
 * Real Gemini keys start with 'AIza' and are ~39 chars.
 */
const isValidApiKey = (key: string | null | undefined): key is string => {
  if (!key) return false;
  const trimmed = key.trim();
  // Reject obvious placeholders and short/empty strings
  if (trimmed.length < 10) return false;
  if (trimmed.toLowerCase().includes('placeholder')) return false;
  if (trimmed.toLowerCase() === 'your_api_key_here') return false;
  return true;
};

/**
 * Gets the active API key. Priority:
 * 1. User-saved key in localStorage (runtime)
 * 2. Environment variable from build time (process.env.API_KEY)
 * Only returns keys that pass basic validity checks.
 */
export const getActiveApiKey = (): string | null => {
  try {
    const saved = localStorage.getItem("swarasutra_api_key");
    if (isValidApiKey(saved)) return saved;
  } catch { }
  const envKey = process.env.API_KEY || null;
  return isValidApiKey(envKey) ? envKey : null;
};

/**
 * Saves an API key to localStorage for runtime use.
 */
export const saveApiKey = (key: string) => {
  try {
    localStorage.setItem("swarasutra_api_key", key);
  } catch (e) {
    console.warn("swarasutra: Failed to save API key", e);
  }
};

/**
 * Removes a saved API key from localStorage.
 */
export const clearApiKey = () => {
  try {
    localStorage.removeItem("swarasutra_api_key");
  } catch { }
};

/**
 * Tests the API key by making a lightweight model list request.
 * Returns { success: boolean, message: string }.
 */
export const testApiKey = async (key: string): Promise<{ success: boolean, message: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Respond with only the word "OK".',
      config: { temperature: 0, maxOutputTokens: 5 }
    });
    if (response.text) {
      return { success: true, message: "Connection verified successfully!" };
    }
    return { success: false, message: "API responded but returned empty data." };
  } catch (error: any) {
    const msg = (error?.message || "").toLowerCase();
    if (msg.includes("api key") || msg.includes("403") || msg.includes("unauthenticated") || msg.includes("invalid")) {
      return { success: false, message: "Invalid API Key. Please check and try again." };
    }
    if (msg.includes("429") || msg.includes("quota")) {
      return { success: true, message: "Key is valid (quota limit may apply)." };
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return { success: false, message: "Network error. Check your internet connection." };
    }
    return { success: false, message: error?.message || "Connection test failed." };
  }
};

// ─── Sleep Utility ───────────────────────────────────────────────────────
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Token-Bucket Rate Limiter ──────────────────────────────────────────
export class RateLimiter {
  private timestamps: number[] = [];
  private activeRequests = 0;
  private waitQueue: (() => void)[] = [];
  private pausedUntil = 0;
  private lastRequestAt = 0;

  constructor(
    private maxRPM: number = RATE_LIMIT_RPM,
    private maxConcurrency: number = RATE_LIMIT_CONCURRENCY,
    private minInterCallDelayMs: number = MIN_INTER_CALL_DELAY_MS
  ) { }

  async acquire(): Promise<void> {
    // Wait for concurrency slot
    while (this.activeRequests >= this.maxConcurrency || Date.now() < this.pausedUntil) {
      if (Date.now() < this.pausedUntil) {
        const wait = this.pausedUntil - Date.now();
        await sleep(wait); // Sleep until pause is over
      } else {
        await new Promise<void>(resolve => this.waitQueue.push(resolve));
      }
    }

    // Enforce RPM limit
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < 60_000);

    if (this.timestamps.length >= this.maxRPM) {
      const oldestInWindow = this.timestamps[0];
      const waitTime = 60_000 - (now - oldestInWindow) + 100; // +100ms buffer
      console.warn(`swarasutra: RPM limit reached. Waiting ${Math.round(waitTime / 1000)}s...`);
      await sleep(waitTime);
      this.timestamps = this.timestamps.filter(t => Date.now() - t < 60_000);
    }

    // Enforce minimum inter-call spacing to avoid bursty calls
    const sinceLast = Date.now() - this.lastRequestAt;
    if (sinceLast < this.minInterCallDelayMs) {
      await sleep(this.minInterCallDelayMs - sinceLast);
    }

    this.timestamps.push(Date.now());
    this.lastRequestAt = Date.now();
    this.activeRequests++;
  }

  release(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.processQueue();
  }

  pause(ms: number) {
    this.pausedUntil = Date.now() + ms;
  }

  private processQueue() {
    if (this.activeRequests < this.maxConcurrency && this.waitQueue.length > 0 && Date.now() >= this.pausedUntil) {
      const next = this.waitQueue.shift();
      if (next) next();
    }
  }
}

/** @deprecated Use getModelRateLimiter(model) instead */
export const apiRateLimiter = new RateLimiter();

// ─── Per-Model Rate Limiters ────────────────────────────────────────
/** Determines if a model string is a "pro" tier model */
const isProModel = (model?: string): boolean => {
  if (!model) return true; // conservative: assume pro if unknown
  return model.includes('pro');
};

const modelRateLimiters = new Map<string, RateLimiter>();

/** Returns a rate limiter tuned to the model's free-tier limits */
export const getModelRateLimiter = (model?: string): RateLimiter => {
  const tier = isProModel(model) ? 'pro' : 'flash';
  let limiter = modelRateLimiters.get(tier);
  if (!limiter) {
    if (tier === 'pro') {
      limiter = new RateLimiter(RATE_LIMIT_RPM_PRO, RATE_LIMIT_CONCURRENCY, MIN_INTER_CALL_DELAY_PRO_MS);
    } else {
      limiter = new RateLimiter(RATE_LIMIT_RPM_FLASH, RATE_LIMIT_CONCURRENCY, MIN_INTER_CALL_DELAY_FLASH_MS);
    }
    modelRateLimiters.set(tier, limiter);
  }
  return limiter;
};

// ─── Workflow Queue ───────────────────────────────────────────────────
let workflowQueue: Promise<void> = Promise.resolve();

/**
 * Serializes long-running agent workflows to prevent overlapping request bursts.
 */
export const enqueueWorkflow = async <T>(task: () => Promise<T>): Promise<T> => {
  const run = workflowQueue.then(task, task);
  workflowQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
};

// ─── Singleton AI Client ────────────────────────────────────────────────
let _aiClient: GoogleGenAI | null = null;
let _aiClientKey: string | null = null;

/**
 * Returns a cached GoogleGenAI client. Reuses the same instance
 * as long as the API key hasn't changed, enabling SDK-level
 * connection pooling and reducing overhead.
 */
export const getAIClient = (): GoogleGenAI => {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    throw new GeminiError("API Key Missing: Please add your Gemini API key in the sidebar under 'Studio Brain'.", 'AUTH');
  }
  if (_aiClient && _aiClientKey === apiKey) {
    return _aiClient;
  }
  _aiClient = new GoogleGenAI({ apiKey });
  _aiClientKey = apiKey;
  return _aiClient;
};

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  model?: string,
  retries?: number,
  delay?: number
): Promise<T> {
  const isPro = isProModel(model);
  const maxRetries = retries ?? (isPro ? RETRY_MAX_ATTEMPTS_PRO : RETRY_MAX_ATTEMPTS);
  const baseDelay = delay ?? RETRY_BASE_DELAY_MS;
  const limiter = getModelRateLimiter(model);

  // Acquire rate limiter token before each attempt
  await limiter.acquire();
  try {
    const result = await operation();
    limiter.release();
    return result;
  } catch (error: any) {
    limiter.release();

    const msg = (error?.message || "").toLowerCase();
    // Non-retryable errors — throw immediately
    if (msg.includes("api key") || msg.includes("safety") || msg.includes("blocked") || msg.includes("403")) {
      throw error;
    }
    if (maxRetries === 0) throw error;

    const isTransient = msg.includes("429") || msg.includes("503") || msg.includes("overloaded") || msg.includes("fetch") || msg.includes("network");
    if (!isTransient) throw error;

    // Exponential backoff with jitter to prevent thundering herd
    const jitter = baseDelay * RETRY_JITTER_FACTOR * (Math.random() * 2 - 1);
    const actualDelay = Math.max(1000, Math.round(baseDelay + jitter));
    console.warn(`swarasutra: [${model || 'unknown'}] Transient error (${msg.slice(0, 60)}...). Retrying in ${actualDelay}ms (${maxRetries} attempts left)`);

    // Pause this model's rate limiter to prevent other same-model requests from hitting 429
    limiter.pause(actualDelay);

    await sleep(actualDelay);
    return retryWithBackoff(operation, model, maxRetries - 1, baseDelay * 2);
  }
}

export const wrapGenAIError = (error: any): GeminiError => {
  const msg = (error?.message || error?.toString() || "").toLowerCase();

  if (msg.includes("api key") || msg.includes("403") || msg.includes("unauthenticated")) {
    return new GeminiError("Neural Link Failed: Invalid or missing Brain Key.", 'AUTH', error);
  }
  if (msg.includes("429") || msg.includes("quota")) {
    return new GeminiError("Studio Overloaded: Too many requests. Please pause.", 'QUOTA', error);
  }
  if (msg.includes("safety") || msg.includes("blocked")) {
    return new GeminiError("Content Policy: The request triggered safety filters.", 'SAFETY', error);
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return new GeminiError("Transmission Error: Check your connection.", 'NETWORK', error);
  }

  return new GeminiError(error?.message || "An unexpected neural fault occurred.", 'UNKNOWN', error);
};

export const cleanAndParseJSON = <T>(text: string): T => {
  if (!text) throw new GeminiError("AI returned empty data structure.", 'PARSING');

  let jsonString = text;
  const codeBlockRegex = /```(?:json)?([\s\S]*?)```/;
  const match = text.match(codeBlockRegex);

  if (match && match[1]) {
    jsonString = match[1].trim();
  } else {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = text.substring(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    throw new GeminiError("Neural Parsing Error: Invalid data structure received.", 'PARSING', e);
  }
};

export const formatLyricsForDisplay = (data: GeneratedLyrics): string => {
  try {
    if (!data || !data.sections) return "Error: Invalid lyrics format.";
    let output = "";
    if (data.title) output += `Title: ${data.title}\n`;
    if (data.hookLine) output += `Hook: ${data.hookLine}\n`;
    if (data.language) output += `Language: ${data.language}\n`;
    if (data.dialect) output += `Dialect: ${data.dialect}\n`;
    if (data.ragam) output += `Raagam: ${data.ragam}\n`;
    if (data.taalam) output += `Taalam: ${data.taalam}\n`;
    if (data.structure) output += `Structure: ${data.structure}\n`;
    if (data.navarasa) output += `Navarasa: ${data.navarasa}\n`;
    if (data.sentiment) output += `Sentiment: ${data.sentiment}\n`;
    output += `\n`;

    data.sections.forEach(section => {
      let header = section.sectionName ? section.sectionName.trim().replace(/[\[\]]/g, '') : "Section";
      output += `[${header}]\n`;
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, index) => {
          // Check if first line matches header (ignoring case/brackets) to prevent duplication
          if (index === 0) {
            const normalizedLine = line.trim().toLowerCase().replace(/[\[\]]/g, '');
            const normalizedHeader = header.toLowerCase();
            if (normalizedLine === normalizedHeader) {
              return; // Skip duplicate header
            }
          }
          output += `${line}\n`;
        });
      }
      output += `\n`;
    });

    if (data.pronunciationGuide && data.pronunciationGuide.length > 0) {
      output += `\n[Pronunciation Guide]\n`;
      data.pronunciationGuide.forEach(entry => {
        output += `${entry.word} | ${entry.phonetic} | ${entry.meaning}\n`;
      });
    }

    return output;
  } catch (error) {
    return "Error occurred while formatting lyrics.";
  }
};

/**
 * Converts Hex to HSL for Tailwind CSS variable compatibility.
 * Returns values as "H S% L%" (space separated) for use in `hsl(var(--name) / <alpha>)`.
 */
export function hexToHSL(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}

export function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

export interface LyricViewSection {
  type: 'header' | 'content';
  text: string;
  id: number;
}

export const parseLyricsToSections = (content: string): LyricViewSection[] => {
  if (!content) return [];
  const lines = content.split('\n');
  const sections: LyricViewSection[] = [];
  let id = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      sections.push({ type: 'content', text: '', id: id++ });
      return;
    }
    const metaKeywords = [
      'Title:', 'Hook:', 'Language:', 'Dialect:', 'Raagam:',
      'Taalam:', 'Structure:', 'Navarasa:', 'Sentiment:'
    ];
    if (metaKeywords.some(k => trimmed.startsWith(k))) return;

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      sections.push({ type: 'header', text: trimmed, id: id++ });
    } else {
      sections.push({ type: 'content', text: trimmed, id: id++ });
    }
  });
  return sections;
};

export const countMatras = (text: string): number => {
  if (!text) return 0;
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const segmenter = new (Intl as any).Segmenter('te', { granularity: 'grapheme' });
    const segments = [...segmenter.segment(text)];
    return segments.filter((s: any) => s.segment.trim().length > 0).length;
  }
  return text.trim().split(/\s+/).join('').length;
};

export const generatePDF = async (elementId: string, title: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("PDF Export: Element not found");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0f172a',
      logging: false,
      ignoreElements: (el) => el.classList.contains('no-pdf')
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const renderWidth = imgWidth * ratio;
    const renderHeight = imgHeight * ratio;
    const imgX = (pdfWidth - renderWidth) / 2;
    const imgY = 10;

    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
    pdf.addImage(imgData, 'PNG', imgX, imgY, renderWidth, renderHeight);

    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text("Generated by swarasutra AI Studio", pdfWidth / 2, pdfHeight - 10, { align: "center" });

    pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'swarasutra_lyrics'}.pdf`);
  } catch (error) {
    console.error("PDF Generation Failed", error);
    alert("Could not generate PDF. Please try again.");
  }
};
