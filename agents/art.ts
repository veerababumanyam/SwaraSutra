
import { GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL, MODEL_ART } from "../config";
import { retryWithBackoff, wrapGenAIError, getAIClient } from "../utils";

export const runArtAgent = async (
  title: string, 
  lyricsSnippet: string, 
  mood: string,
  model: string = MODEL_ART
): Promise<string | null> => {
  const ai = getAIClient();

  try {
    // Step 1: Generate a creative image prompt based on the lyrics
    const promptResponse = await retryWithBackoff(async () => await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `
        Role: Expert Visual Artist.
        Task: Create a detailed text-to-image prompt for an album cover based on this song.
        
        Song Title: ${title}
        Mood: ${mood}
        Lyrics Snippet: "${lyricsSnippet.substring(0, 200)}..."
        
        Requirements:
        - Visual Style: Cinematic, High Detail, Digital Art.
        - Lighting: Dramatic.
        - Color Palette: Matching the '${mood}' emotion.
        - NO TEXT in the image description (except maybe the vibe).
        - Output: JUST the raw prompt string.
      `
    }), GEMINI_MODEL) as GenerateContentResponse;

    const imagePrompt = promptResponse.text || `Album cover for ${title}, ${mood} atmosphere, cinematic lighting, high quality`;

    // Step 2: Generate the Image using selected model
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: imagePrompt }] },
        config: {
          imageConfig: {
              aspectRatio: "1:1"
          }
        }
    }), model) as GenerateContentResponse;

    // The response may contain both image and text parts; iterate to find the image part.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Art Agent Error:", error);
    throw wrapGenAIError(error);
  }
};
