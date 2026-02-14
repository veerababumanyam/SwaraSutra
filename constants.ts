
import { AppTheme, AgentType } from "./types";

export const APP_NAME = "swarasutra";
export const APP_TAGLINE = "AI Agent-based Indian Cinema Lyric Writer";

export const BILLING_DOCS_URL = "https://ai.google.dev/gemini-api/docs/billing";
export const API_KEY_GUIDE_URL = "https://aistudio.google.com/app/apikey";

export interface ModelMetadata {
  id: string;
  name: string;
  description: string;
  tier: 'performance' | 'quality' | 'specialized';
  capabilities: ('text' | 'image' | 'thinking' | 'audio')[];
}

export const MODEL_REGISTRY: ModelMetadata[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    description: 'Ultra-fast response for orchestration and formatting.',
    tier: 'performance',
    capabilities: ['text', 'audio']
  },
  {
    id: 'gemini-flash-lite-latest',
    name: 'Gemini Flash Lite',
    description: 'Cost-efficient, high-speed model for lightweight tasks.',
    tier: 'performance',
    capabilities: ['text']
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro',
    description: 'Advanced reasoning with Thinking capability for complex poetic metaphors.',
    tier: 'quality',
    capabilities: ['text', 'thinking', 'audio']
  },
  {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini 2.5 Image',
    description: 'Standard cinematic image generation.',
    tier: 'specialized',
    capabilities: ['image']
  },
  {
    id: 'gemini-3-pro-image-preview',
    name: 'Gemini 3 Image Pro',
    description: 'High-fidelity 2K/4K artistic rendering.',
    tier: 'quality',
    capabilities: ['image']
  },
  {
    id: 'gemini-2.5-flash-preview-tts',
    name: 'Gemini TTS',
    description: 'High-quality text-to-speech synthesis.',
    tier: 'specialized',
    capabilities: ['text', 'audio']
  }
];

// Default Model Configurations matching specific tasks
export const GEMINI_MODEL = 'gemini-3-flash-preview'; // General tasks
export const GEMINI_MODEL_QUALITY = 'gemini-3-pro-preview'; // Complex Lyricist tasks
export const MODEL_DEFAULT = GEMINI_MODEL;
export const MODEL_ART = 'gemini-2.5-flash-image';
export const MODEL_TTS = 'gemini-2.5-flash-preview-tts';
export const MODEL_AUDIO_ANALYZER = 'gemini-3-flash-preview';
export const MODEL_LIVE = 'gemini-2.5-flash-native-audio-preview-12-2025';

export const DEFAULT_AGENT_MODELS: Record<AgentType, string> = {
  ORCHESTRATOR: 'gemini-3-flash-preview',
  MULTIMODAL: 'gemini-3-flash-preview',
  EMOTION: 'gemini-3-flash-preview',
  RESEARCH: 'gemini-3-flash-preview',
  // Experts use Flash for speed; specialized directives don't need deep reasoning
  FOLK_EXPERT: 'gemini-3-flash-preview',
  DEVOTIONAL_EXPERT: 'gemini-3-flash-preview',
  // Lyricist uses Pro for Thinking capability (Rhyme schemes, Meter)
  LYRICIST: 'gemini-3-pro-preview',
  COMPLIANCE: 'gemini-3-flash-preview',
  REVIEW: 'gemini-3-flash-preview',
  FORMATTER: 'gemini-3-flash-preview',
  ART: 'gemini-2.5-flash-image',
  TTS: 'gemini-2.5-flash-preview-tts',
  CHAT: 'gemini-3-flash-preview',
  REGIONAL_EXPERT: 'gemini-3-flash-preview',
  AUDIO_ANALYST: 'gemini-3-flash-preview',
  DICTIONARY: 'gemini-3-flash-preview',
  KIDS_EXPERT: 'gemini-3-flash-preview',
  CRITICS: 'gemini-3-pro-preview' // Critics need deep reasoning
};

// Rate Limiting Configuration
export const RATE_LIMIT_RPM = 3; // Max requests per minute to Gemini API (conservative default)
export const RATE_LIMIT_CONCURRENCY = 1; // Max concurrent API calls
export const MIN_INTER_CALL_DELAY_MS = 1500; // Min delay between sequential agent steps
export const RETRY_BASE_DELAY_MS = 5000; // Base delay for retry backoff on 429s
export const RETRY_MAX_ATTEMPTS = 4; // Max retry attempts for transient errors (flash)
export const RETRY_JITTER_FACTOR = 0.3; // Random jitter ±30% to prevent thundering herd

// Per-model rate limits (Gemini Free Tier)
export const RATE_LIMIT_RPM_PRO = 2;              // gemini-*-pro-* free tier limit
export const RATE_LIMIT_RPM_FLASH = 10;            // gemini-*-flash-* free tier (actual ~15, conservative)
export const MIN_INTER_CALL_DELAY_PRO_MS = 31000;  // 60s / 2 RPM = 30s + 1s buffer
export const MIN_INTER_CALL_DELAY_FLASH_MS = 1500;  // Comfortable spacing for flash
export const RETRY_MAX_ATTEMPTS_PRO = 2;           // Fewer retries for pro to avoid burning RPM window

export const PROMPT_VERSION = "7.3.3";
export const AUTO_OPTION = "Auto (AI Detect)";
export const CUSTOM_MODEL_OPTION = "CUSTOM_ID";

// Updated Default Structure - Removed "Smart Blockbuster" to prevent short outputs
export const DEFAULT_SONG_STRUCTURE = "Standard Cinematic (Intro-Verse1-Chorus-Verse2-Bridge-Chorus-Outro)";

export const DEFAULT_HQ_TAGS = "Dolby Atmos, DTS:X, Spatial Audio, Binaural Recording, 8D Audio, High Fidelity, Masterpiece, Crystal Clear, Neural Mix, Immersive Soundscape, 4K Audio Resolution";

export const GLOBAL_FUSION_STYLES = [
  "Afrobeat (Amapiano/South African)",
  "Arabic (Maqam/Oud/Trap)",
  "Spanish (Flamenco/Reggaeton)",
  "Italian (Opera/Italo-Disco)",
  "Latin (Salsa/Bossa Nova)",
  "Japanese (City Pop/Shamisen)",
  "Korean (K-Pop/Ballad)",
  "Nordic (Viking Folk/Metal)",
  "Cyberpunk (Phonk/Synthwave)"
];

export const MOOD_OPTIONS = [
  AUTO_OPTION, "Happy", "Sad (Pathos)", "Energetic", "Peaceful", "Romantic (Shringara)",
  "Angry (Raudra)", "Mysterious", "Funny (Hasya)", "Courageous (Veera)", "Playful (Kids)",
  "Devotional (Bhakti)", "Meditative (Dhyana)", "Philosophical", "Melancholic", "Triumphant",
  "Inspirational", "Fear/Horror", "Viral / Attention Grabbing", "Custom"
];

export const STYLE_OPTIONS = [
  AUTO_OPTION, "Cinematic (Filmy)", "Mass Beat (Dappu/Teenmaar)", "Melody (Classical)",
  "Western Pop Fusion", "Rap/Hip-Hop (Desi)", "Folk (Jaanapada)", "Devotional (Bhajan)",
  "Ghazal/Sufi", "Rock/Metal Fusion", "Electronic/EDM", "Lullaby", "Item Song (Party)",
  "Custom"
];

export const STRUCTURE_OPTIONS = [
  AUTO_OPTION,
  DEFAULT_SONG_STRUCTURE,
  "Power Blockbuster (Intro-Hook-Verse1-Chorus-Verse2-Bridge-Chorus-Outro)",
  "Viral Reel (40s Hook)",
  "Ghazal (Sher-Matla-Maqta)",
  "Carnatic (Pallavi-Anupallavi-Charanam)",
  "Folk (Call & Response)",
  "Ballad (Slow Build)",
  "Custom"
];

export const RHYME_SCHEME_OPTIONS = [
  AUTO_OPTION, "AABB (Couplets)", "ABAB (Alternate)", "AAAA (Monorhyme)",
  "Prasa (Telugu 2nd Letter)", "Antya Prasa (End Rhyme)", "Free Verse", "Custom"
];

export const SINGER_STYLE_OPTIONS = [
  AUTO_OPTION, "Male Solo", "Female Solo", "Duet (Male/Female)", "Group Chorus",
  "Child Vocals", "Sufi High Pitch", "Deep Bass (Villain)", "Whisper/ASMR", "Custom"
];

export const COMPLEXITY_OPTIONS = [
  AUTO_OPTION, "Simple (Colloquial)", "Poetic (Metaphorical)", "Complex (Literary)",
  "Classical (Grandhika)", "Viral Hook (Punchy)", "Toddler (0-3 yrs)", "Kids (4-8 yrs)"
];

export const DIALECT_OPTIONS = [
  AUTO_OPTION,
  "Standard (Grandhika)",
  "Telangana Yaasa (Rustic)",
  "Rayalaseema Yaasa",
  "Andhra/Godavari Yaasa",
  "Madras Bashai (Tamil Slang)",
  "Kongu Tamil",
  "Hyderabadi Hindi/Urdu",
  "Mumbai Slang (Tapori)",
  "Braj Bhasha",
  "Custom"
];

export const DEFAULT_THEMES: AppTheme[] = [
  {
    id: "swarasutra-default",
    name: "swarasutra Dark",
    colors: {
      bgMain: "#0f172a", // Slate 950
      bgSidebar: "#1e293b", // Slate 800
      textMain: "#f8fafc", // Slate 50
      textSecondary: "#94a3b8", // Slate 400
      accent: "#06b6d4", // Cyan 500 (Vibrant)
      accentText: "#ffffff",
      border: "#334155" // Slate 700
    }
  },
  {
    id: "retro-gold",
    name: "Retro Gold",
    colors: {
      bgMain: "#2a221b",
      bgSidebar: "#45382e",
      textMain: "#faebd7",
      textSecondary: "#d2b48c",
      accent: "#d4af37",
      accentText: "#000000",
      border: "#8b4513"
    }
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    colors: {
      bgMain: "#050511",
      bgSidebar: "#0a0a20",
      textMain: "#e0e0ff",
      textSecondary: "#a0a0c0",
      accent: "#ff00ff",
      accentText: "#ffffff",
      border: "#300050"
    }
  },
  {
    id: "forest-hymn",
    name: "Forest Hymn",
    colors: {
      bgMain: "#0d1f14",
      bgSidebar: "#163321",
      textMain: "#e0f2e9",
      textSecondary: "#8ab399",
      accent: "#10b981",
      accentText: "#ffffff",
      border: "#1f4a33"
    }
  }
];

export const AGENT_SUBTASKS: Record<string, string[]> = {
  ORCHESTRATOR: ["Analyzing request...", "Delegating tasks...", "Compiling results..."],
  RESEARCH: ["Scanning cultural database...", "Extracting metaphors...", "Verifying dialect usage..."],
  EMOTION: ["Detecting Navarasa...", "Measuring intensity...", "Matching musical mood..."],
  LYRICIST: ["Drafting verses...", "Checking meter (Chandassu)...", "Applying rhymes..."],
  REVIEW: ["Auditing grammar...", "Checking flow...", "Polishing content..."],
  COMPLIANCE: ["Checking copyright...", "Verifying safety...", "Finalizing report..."],
  FORMATTER: ["Structuring tags...", "Generating Suno prompt...", "Finalizing output..."],
  MULTIMODAL: ["Processing visual data...", "Extracting context...", "Mapping to lyrics..."],
  DEVOTIONAL_EXPERT: ["Consulting agamas...", "Verifying epithets...", "Checking sanctity..."],
  FOLK_EXPERT: ["Injecting rural slang...", "Adding rhythmic hums...", "Verifying authenticity..."],
  KIDS_EXPERT: ["Simplifying vocabulary...", "Creating viral hooks...", "Adding action tags..."],
  REGIONAL_EXPERT: ["Enforcing script rules...", "Checking dialect...", "Verifying grammar..."],
  AUDIO_ANALYST: ["Detecting tempo...", "Analyzing key...", "Mapping structure..."],
  CRITICS: ["Council debating...", "Reviewing flaws...", "Voting on consensus..."],
  TTS: ["Synthesizing voice...", "Applying emotion...", "Rendering audio..."],
  ART: ["Analyzing lyrics...", "Designing cover...", "Rendering image..."],
  CHAT: ["Thinking...", "Typing..."],
  DICTIONARY: ["Searching lexicon...", "Finding synonyms...", "Checking rhymes..."]
};
