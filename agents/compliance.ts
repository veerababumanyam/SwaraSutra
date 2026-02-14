
import { Type, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_COMPLIANCE } from "../prompts";
import { ComplianceReport, GeneratedLyrics } from "../types";
import { cleanAndParseJSON, retryWithBackoff, getAIClient } from "../utils";
import { GEMINI_MODEL } from "../constants";

export const runComplianceAgent = async (lyrics: GeneratedLyrics | string, model: string = GEMINI_MODEL): Promise<ComplianceReport> => {
  const safeDefault: ComplianceReport = {
    originalityScore: 100,
    flaggedPhrases: [],
    similarSongs: [],
    verdict: "Safe"
  };

  try {
    const ai = getAIClient();
    const lyricsText = typeof lyrics === 'string' ? lyrics : JSON.stringify(lyrics);

    const complianceSchema = {
      type: Type.OBJECT,
      properties: {
        originalityScore: { type: Type.INTEGER },
        flaggedPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
        similarSongs: { type: Type.ARRAY, items: { type: Type.STRING } },
        verdict: { type: Type.STRING }
      },
      required: ["originalityScore", "verdict"]
    };

    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: model,
      contents: `Analyze these lyrics for copyright risks:\n${lyricsText}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COMPLIANCE,
        responseMimeType: "application/json",
        responseSchema: complianceSchema,
        temperature: 0.1
      }
    }), model) as GenerateContentResponse;

    if (response.text) {
      return cleanAndParseJSON<ComplianceReport>(response.text);
    }
    return safeDefault;
  } catch (error) {
    return safeDefault;
  }
};