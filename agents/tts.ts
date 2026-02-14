
import { Modality } from "@google/genai";
import { MODEL_TTS } from "../constants";
import { getAIClient, retryWithBackoff, wrapGenAIError } from "../utils";

export const runTTSAgent = async (
  text: string, 
  voice: 'Kore' | 'Puck' | 'Zephyr' | 'Charon' = 'Kore',
  model: string = MODEL_TTS
): Promise<string | null> => {
  const ai = getAIClient();
  
  // Clean text of square brackets for better recitation
  const cleanText = text.replace(/\[.*?\]/g, "").trim();
  
  const prompt = `Read these lyrics soulfully and rhythmically, like a professional lyricist reciting their work. Pay attention to the meter and flow: \n\n ${cleanText}`;

  try {
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    }), model);

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Agent Error:", error);
    throw wrapGenAIError(error);
  }
};
