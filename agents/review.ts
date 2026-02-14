
import { Type, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_REVIEW } from "../prompts";
import { GeneratedLyrics, LanguageProfile, GenerationSettings } from "../types";
import { cleanAndParseJSON, formatLyricsForDisplay, retryWithBackoff, getAIClient } from "../utils";
import { GEMINI_MODEL_QUALITY, AUTO_OPTION } from "../constants";
import { RegionalSkill } from "./skills/regional"; // NEW

export const runReviewAgent = async (
  draftLyrics: string,
  originalContext: string,
  languageProfile: LanguageProfile,
  generationSettings: GenerationSettings | undefined,
  model: string = GEMINI_MODEL_QUALITY
): Promise<string> => {
  const ai = getAIClient();

  const lyricsSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sectionName: { type: Type.STRING },
            lines: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["sectionName", "lines"]
        }
      },
      pronunciationGuide: {
        type: Type.ARRAY,
        description: "A guide for tricky words",
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: "The word in native script" },
            phonetic: { type: Type.STRING, description: "English phonetic spelling (e.g. 'Padha-Silpi')" },
            meaning: { type: Type.STRING, description: "Brief meaning in English" }
          },
          required: ["word", "phonetic", "meaning"]
        }
      }
    },
    required: ["title", "sections"]
  };

  // 1. Get Consistency Rules from Regional Skill
  // We mock a simple context since we just need the linguistic rules
  const skillInstruction = RegionalSkill.getInstruction ? RegionalSkill.getInstruction({
    userRequest: originalContext,
    settings: generationSettings || {} as any,
    language: languageProfile
  }) : "";

  const rhyme = generationSettings?.rhymeScheme === "Custom" ? generationSettings.customRhymeScheme : (generationSettings?.rhymeScheme || AUTO_OPTION);

  let specificAudit = "Check for consistent flow and cinematic quality.";
  if (rhyme?.includes("AAAA")) {
    specificAudit = "STRICT AUDIT FOR MONORHYME (AAAA): Check every stanza. Lines 1, 2, 3, and 4 MUST end with the same sound. If lines 3 and 4 switch to a different rhyme (like AABB), REWRITE them to match Lines 1 and 2.";
  } else if (rhyme?.includes("AABB")) {
    specificAudit = "STRICT AUDIT FOR COUPLETS (AABB): Ensure Line 1 rhymes with 2, and Line 3 rhymes with 4.";
  }

  const prompt = `
    ### DRAFT LYRICS:
    ${draftLyrics}
    
    ### AUDIT PARAMETERS:
    - TARGET LANGUAGE: ${languageProfile.primary}
    - REQUIRED RHYME SCHEME: ${rhyme}
    
    ### LINGUISTIC CONSTITUTION (FROM REGIONAL GUARDIAN):
    ${skillInstruction}
    
    ### TASK: 
    1. **Rhyme Structure Audit:** ${specificAudit}
    2. **Hook Repetition Check:** MANDATORY: The "Power Hook" must be in the [Intro], [Chorus], and [Outro]. If it is missing from the [Outro], you MUST rewrite the ending to include it.
    3. **Linguistic Purity:** Replace any weak vocabulary with cinematic terms.
    4. **Poetic Depth Audit:** If the metaphors are too simple, elevate them to a "Mahakavi" (Great Poet) level by deepening the imagery.
    5. **FULL TEXT AUDIT:** Check if the draft uses lazy instructions like "(Chorus Repeats)" or "(Repeat Hook)". If found, DELETE the instruction and INSERT the actual full text of the lines. The output must be ready for an Audio AI to read line-by-line.
    
    ### PRONUNCIATION & GLOSSARY (NEW):
    Identify 4-6 tricky words, dialect-specific slang (Yaasa), or Grandhika (Classical) terms used in your polished lyrics.
    Provide a "Pronunciation Guide" in the JSON output.
    
    Return the polished results as JSON.
  `;

  try {
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_REVIEW,
        responseMimeType: "application/json",
        responseSchema: lyricsSchema,
        temperature: 0.2,
      }
    }), model) as GenerateContentResponse;

    if (response.text) {
      const data = cleanAndParseJSON<GeneratedLyrics>(response.text);
      return formatLyricsForDisplay(data);
    }
    return draftLyrics;
  } catch (error) {
    console.error("Review Agent Failed:", error);
    return draftLyrics;
  }
};