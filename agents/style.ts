
import { GenerateContentResponse } from "@google/genai";
import { retryWithBackoff, wrapGenAIError, getAIClient } from "../utils";
import { StyleSkill } from "./skills/style";
import { GEMINI_MODEL } from "../constants";

export const runStyleAgent = async (
  currentInput: string,
  lyricsContext: string,
  model: string = GEMINI_MODEL
): Promise<string> => {
  const ai = getAIClient();

  // Reuse the core instruction from the Skill
  // We mock a simple context for the skill activator/instruction
  const skillInstruction = StyleSkill.getInstruction ? StyleSkill.getInstruction({
    userRequest: currentInput,
    settings: { style: currentInput, mood: "Cinematic", dialect: "Standard" } as any,
    language: { primary: "Telugu", secondary: "English", tertiary: "Hindi" }
  }) : StyleSkill.coreInstruction;

  const prompt = `
    USER INPUT / ROUGH IDEA: "${currentInput}"
    LYRICS CONTEXT: "${lyricsContext.substring(0, 500)}..."

    ### SONIC ALCHEMIST PROTOCOL:
    ${skillInstruction}

    TASK: Construct the "Tri-Layer Sonic Stack" based on the protocol above.
    Output ONLY the final composite style string.
  `;

  try {
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.85,
      }
    }), model) as GenerateContentResponse;

    return response.text?.trim() || currentInput;

  } catch (error) {
    console.error("Style Agent Error:", error);
    throw wrapGenAIError(error);
  }
};
