import { Type, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_REVIEW, SYSTEM_INSTRUCTION_COMPLIANCE, SYSTEM_INSTRUCTION_FORMATTER, DEFAULT_HQ_TAGS } from "../prompts";
import { ComplianceReport, GeneratedLyrics, LanguageProfile, GenerationSettings } from "../types";
import { cleanAndParseJSON, formatLyricsForDisplay, retryWithBackoff, getAIClient } from "../utils";
import { GEMINI_MODEL_QUALITY, AUTO_OPTION } from "../constants";
import { RegionalSkill } from "./skills/regional";

export interface PostProcessOutput {
  complianceReport: ComplianceReport;
  reviewedLyrics: string;
  formattedLyrics: string;
  stylePrompt: string;
}

export const runPostProcessAgent = async (
  draftLyrics: string,
  originalContext: string,
  languageProfile: LanguageProfile,
  generationSettings: GenerationSettings | undefined,
  model: string = GEMINI_MODEL_QUALITY
): Promise<PostProcessOutput> => {
  const ai = getAIClient();

  const schema = {
    type: Type.OBJECT,
    properties: {
      complianceReport: {
        type: Type.OBJECT,
        properties: {
          originalityScore: { type: Type.INTEGER },
          flaggedPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
          similarSongs: { type: Type.ARRAY, items: { type: Type.STRING } },
          verdict: { type: Type.STRING }
        },
        required: ["originalityScore", "verdict"]
      },
      polishedLyrics: {
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
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                phonetic: { type: Type.STRING },
                meaning: { type: Type.STRING }
              },
              required: ["word", "phonetic", "meaning"]
            }
          }
        },
        required: ["title", "sections"]
      },
      formattedLyrics: { type: Type.STRING },
      stylePrompt: { type: Type.STRING }
    },
    required: ["complianceReport", "polishedLyrics", "formattedLyrics", "stylePrompt"]
  };

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

  const combinedSystemInstruction = `${SYSTEM_INSTRUCTION_REVIEW}\n${SYSTEM_INSTRUCTION_COMPLIANCE}\n${SYSTEM_INSTRUCTION_FORMATTER}`;

  const prompt = `
    ### DRAFT LYRICS:
    ${draftLyrics}

    ### AUDIT PARAMETERS:
    - TARGET LANGUAGE: ${languageProfile.primary}
    - REQUIRED RHYME SCHEME: ${rhyme}

    ### LINGUISTIC CONSTITUTION (FROM REGIONAL GUARDIAN):
    ${skillInstruction}

    ### TASKS (DO ALL):
    1. **Rhyme Structure Audit:** ${specificAudit}
    2. **Hook Repetition Check:** The "Power Hook" must be in [Intro], [Chorus], and [Outro]. If missing, rewrite the ending to include it.
    3. **Linguistic Purity:** Replace weak vocabulary with cinematic terms.
    4. **Poetic Depth Audit:** Elevate metaphors to "Mahakavi" level where needed.
    5. **FULL TEXT AUDIT:** Remove lazy instructions like "(Repeat Hook)" and insert full text.
    6. **Compliance:** Scan for copyright risk and produce an originality score.
    7. **Formatter:** Format lyrics with strict [Section] tags and produce a 3-layer style prompt.

    ### STYLE PROMPT RULES:
    - **Layer 1 (Native):** Identify native instruments/rhythm from language/context.
    - **Layer 2 (Fusion):** Add a compatible global genre.
    - **Layer 3 (Quality):** Append "${DEFAULT_HQ_TAGS}".

    ### OUTPUT (STRICT JSON):
    Return JSON with:
    - complianceReport
    - polishedLyrics (structured lyrics JSON)
    - formattedLyrics (string with tags)
    - stylePrompt (comma-separated, ready to paste)
  `;

  const response = await retryWithBackoff(async () => await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: combinedSystemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.2
    }
  }), model) as GenerateContentResponse;

  if (!response.text) {
    throw new Error("Post-processing returned empty response");
  }

  const data = cleanAndParseJSON<{
    complianceReport: ComplianceReport;
    polishedLyrics: GeneratedLyrics;
    formattedLyrics: string;
    stylePrompt: string;
  }>(response.text);

  return {
    complianceReport: data.complianceReport,
    reviewedLyrics: formatLyricsForDisplay(data.polishedLyrics),
    formattedLyrics: data.formattedLyrics,
    stylePrompt: data.stylePrompt
  };
};
