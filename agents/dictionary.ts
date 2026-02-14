
import { Type, GenerateContentResponse } from "@google/genai";
import { DictionaryResult } from "../types";
import { cleanAndParseJSON, retryWithBackoff, getAIClient, wrapGenAIError } from "../utils";
import { GEMINI_MODEL } from "../constants";

export const runDictionaryAgent = async (
  word: string,
  language: string,
  context: string,
  model: string = GEMINI_MODEL
): Promise<DictionaryResult> => {
  const ai = getAIClient();

  const schema = {
    type: Type.OBJECT,
    properties: {
      word: { type: Type.STRING },
      language: { type: Type.STRING },
      transliteration: { type: Type.STRING, description: "English script transliteration" },
      synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
      rhymes: { type: Type.ARRAY, items: { type: Type.STRING } },
      metaphors: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["word", "language", "synonyms", "rhymes", "metaphors"]
  };

  const prompt = `
    WORD: "${word}"
    TARGET LANGUAGE: "${language}"
    CONTEXT: "${context}"

    TASK: Act as "Padha-Kosam" (Poetic Dictionary).
    1. Provide 5-6 poetic synonyms (Paryaya Padalu) suitable for lyrics.
    2. Provide 5-6 Rhyming words (Prasa) - specifically "Anthya Prasa" (End Rhyme) or "Yati" (Alliteration).
    3. Provide 2-3 Metaphors involving this word.
    4. Provide the Transliteration in English.
    
    Strictly output JSON.
  `;

  try {
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Indian Language Lexicographer for Poets.",
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3
      }
    }), model) as GenerateContentResponse;

    if (response.text) {
      return cleanAndParseJSON<DictionaryResult>(response.text);
    }
    throw new Error("Empty response from Dictionary Agent");
  } catch (error) {
    throw wrapGenAIError(error);
  }
};
