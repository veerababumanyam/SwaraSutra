
import { Type, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_FORMATTER, DEFAULT_HQ_TAGS } from "../prompts";
import { cleanAndParseJSON, retryWithBackoff, getAIClient } from "../utils";
import { GEMINI_MODEL_QUALITY } from "../constants";

export interface FormatterOutput {
  stylePrompt: string;
  formattedLyrics: string;
}

export const runFormatterAgent = async (lyrics: string, model: string = GEMINI_MODEL_QUALITY): Promise<FormatterOutput> => {
  const ai = getAIClient();

  const schema = {
    type: Type.OBJECT,
    properties: {
      stylePrompt: { type: Type.STRING, description: "The 3-Layer Style Prompt (Native + Fusion + Quality)" },
      formattedLyrics: { type: Type.STRING, description: "Lyrics with strict [Section] tags" }
    },
    required: ["stylePrompt", "formattedLyrics"]
  };

  const prompt = `
    INPUT LYRICS:
    ${lyrics}
    
    TASK: 
    1. **Format Lyrics:** Ensure every section has a [Tag] (e.g. [Verse], [Chorus]). Remove "Title:", "Language:" metadata from the lyrics body.
    2. **Generate Style Prompt:** Create the **Tri-Layer Sonic Stack** for Suno/Udio.
    
    STYLE PROMPT RULES:
    - **Layer 1 (Native):** Identify the instrument/rhythm from the lyrics language/context (e.g., *Dappu, Sannayi, Tabla, Thara Thappattai*).
    - **Layer 2 (Fusion):** Mix it with a compatible modern genre (e.g., *Trap, Lo-Fi, Cinematic Orchestral, Synthwave*).
    - **Layer 3 (Quality):** MANDATORY: Append "${DEFAULT_HQ_TAGS}".
    
    OUTPUT FORMAT:
    Return strictly JSON with 'stylePrompt' and 'formattedLyrics'.
    The 'stylePrompt' should be a single comma-separated string ready for copy-pasting.
  `;

  try {
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_FORMATTER,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    }), model) as GenerateContentResponse;

    if (response.text) {
        return cleanAndParseJSON<FormatterOutput>(response.text);
    }
    return { stylePrompt: `Cinematic Fusion, ${DEFAULT_HQ_TAGS}`, formattedLyrics: lyrics };
  } catch (error) {
    console.warn("Formatter Agent Error, using fallback", error);
    return { stylePrompt: `Global Cinematic, ${DEFAULT_HQ_TAGS}`, formattedLyrics: lyrics };
  }
};