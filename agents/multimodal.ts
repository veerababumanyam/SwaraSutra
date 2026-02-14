
import { GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_MULTIMODAL } from "../prompts";
import { retryWithBackoff, wrapGenAIError, getAIClient } from "../utils";
import { GEMINI_MODEL } from "../constants";

export const runMultiModalAgent = async (
  input: string, 
  media?: { data: string, mimeType: string }, 
  model: string = GEMINI_MODEL
): Promise<string> => {
  if (!media) return input;
  const ai = getAIClient();

  // Feature Requirement: Use Gemini Pro for video understanding
  const isVideo = media.mimeType.startsWith('video/');
  const effectiveModel = isVideo ? 'gemini-3-pro-preview' : model;

  const parts: any[] = [{ text: `User Text Context: ${input}` }];
  
  if (media) {
    parts.push({
      inlineData: { mimeType: media.mimeType, data: media.data }
    });
  }

  try {
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: effectiveModel,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION_MULTIMODAL,
        // Optimization: Remove Thinking for visual analysis. 
        // Describing an image/video scene does not require deep chain-of-thought reasoning, saving tokens.
      },
      contents: [{ role: "user", parts: parts }]
    }), effectiveModel) as GenerateContentResponse;

    return `[${isVideo ? 'Video' : 'Visual'} Analysis: ${response.text || ""}] \n\n Request: ${input}`;
  } catch (error) {
    throw wrapGenAIError(error);
  }
};
