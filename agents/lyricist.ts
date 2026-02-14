
import { Type } from "@google/genai";
import { retryWithBackoff, wrapGenAIError, getAIClient, GeminiError } from "../utils";
import { GEMINI_MODEL_QUALITY, AUTO_OPTION } from "../constants";
import { GenerationSettings, LanguageProfile } from "../types";
import { SYSTEM_INSTRUCTION_LYRICIST } from "../prompts";
import { StrategyResult } from "./strategy";

/**
 * The Lyricist is a pure Executor. It receives a Blueprint and Directives from the Strategy Agent.
 */
export const runLyricistAgent = async (
  strategy: StrategyResult,
  userRequest: string,
  language: LanguageProfile,
  settings: GenerationSettings,
  modelName: string = GEMINI_MODEL_QUALITY,
  customInstructions?: string,
  rhythmContext?: string
): Promise<string> => {
  const ai = getAIClient();
  const lang = language.primary;

  const prompt = `
    ${SYSTEM_INSTRUCTION_LYRICIST}

    ### CORE DIRECTIVES (From Strategy Architect):
    - **Language:** ${lang} (Script: MANDATORY NATIVE SCRIPT).
    - **Dialect Rule:** ${strategy.directives.linguistic}
    - **Cultural Context:** ${strategy.directives.cultural}
    - **Musical Context:** ${strategy.directives.musical}
    
    ### SONG BLUEPRINT (EXECUTE THIS STRUCTURE):
    - **Title Idea:** ${strategy.blueprint.title}
    - **Hook:** "${strategy.blueprint.hookLine}"
    - **Structure:**
      ${strategy.blueprint.sectionsOutline.join("\n      ")}

    ### RESEARCH INSIGHTS (Incorporate these Metaphors):
    ${strategy.researchInsights.map(r => `- ${r}`).join("\n")}

    ### USER REQUEST:
    "${userRequest}"
    ${customInstructions ? `Additional Notes: ${customInstructions}` : ""}
    ${rhythmContext ? `Rhythm Context: ${rhythmContext}` : ""}

    ### TASK:
    Write the full lyrics in ${lang} script. 
    Follow the Blueprint structure exactly. 
  `;

  try {
    const result = await retryWithBackoff(async () => await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { temperature: 0.7 }
    }), modelName);

    if (!result.text) throw new GeminiError("Lyricist generated empty content", 'SERVER');
    return result.text;
  } catch (error) {
    throw wrapGenAIError(error);
  }
};

/**
 * Single Line Rewriter for the Editor (Magic Wand)
 */
export const rewriteLine = async (
  lineText: string,
  instruction: string,
  context: string,
  modelName: string = GEMINI_MODEL_QUALITY
): Promise<string> => {
  const ai = getAIClient();
  const prompt = `
        You are an expert Lyricist Editor.
        Task: Rewrite the following line based on the instruction.
        
        Full Context of Song:
        "${context.substring(0, 1000)}..."
        
        Target Line: "${lineText}"
        Instruction: "${instruction}"
        
        Output ONLY the rewritten line. No definition, no quotes. Keep the same language/script.
    `;

  try {
    const result = await retryWithBackoff(async () => await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { temperature: 0.7 }
    }), modelName);
    return result.text?.trim() || lineText;
  } catch (error) {
    console.error("Rewrite failed", error);
    return lineText;
  }
};

/**
 * Full Song Rewriter based on Critics Feedback
 */
export const runLyricistRewrite = async (
  critiques: string,
  workingLyrics: string,
  language: LanguageProfile,
  modelName: string = GEMINI_MODEL_QUALITY
): Promise<string> => {
  const ai = getAIClient();
  const prompt = `
        ${SYSTEM_INSTRUCTION_LYRICIST}
        
        ### REWRITE TASK:
        You are improving an existing draft based on the "High Council" (Critics) feedback.
        
        ### CRITICS FEEDBACK (IMPLEMENT THESE CHANGES):
        ${critiques}
        
        ### CURRENT DRAFT:
        ${workingLyrics}
        
        ### LANGUAGE: ${language.primary}
        
        Output the FULL rewritten song.
    `;

  try {
    const result = await retryWithBackoff(async () => await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { temperature: 0.7 }
    }), modelName);

    if (!result.text) throw new GeminiError("Rewrite returned empty text", 'SERVER');
    return result.text;
  } catch (error) {
    throw wrapGenAIError(error);
  }
};
