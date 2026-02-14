
import { Message } from "../types";
import { wrapGenAIError, getAIClient, retryWithBackoff } from "../utils";
import { SYSTEM_INSTRUCTION_CHAT } from "../prompts";
import { GEMINI_MODEL } from "../constants";

type Part = { text: string } | { inlineData: { mimeType: string; data: string } };

export interface ChatAgentOptions {
  visual?: {
    data: string;
    mimeType: string;
  };
  model?: string;
}

const getOptimizedHistory = (history: Message[]): { role: string, parts: Part[] }[] => {
  const MAX_HISTORY_TURNS = 15;
  const recentHistory = history
    .filter(m => m.role === "user" || m.role === "model")
    .slice(-MAX_HISTORY_TURNS);

  return recentHistory.map(m => {
    const parts: Part[] = [{ text: m.content }];
    
    if (m.visualData) {
      parts.push({
        inlineData: {
          mimeType: m.visualData.mimeType,
          data: m.visualData.data
        }
      });
    }

    return {
      role: m.role,
      parts
    };
  });
};

const getDynamicInstruction = (history: Message[], currentInput: string) => {
  let instruction = SYSTEM_INSTRUCTION_CHAT;
  const lowerInput = currentInput.toLowerCase();
  const lastModelMsg = [...history].reverse().find(m => m.role === "model");
  
  if (lastModelMsg?.lyricsData) {
    instruction += `\n\n[CONTEXT: POST-GENERATION]\nThe user is discussing the lyrics you just helped orchestrate.`;
  }

  return instruction;
};

export const runChatAgent = async (
  text: string, 
  history: Message[], 
  options: ChatAgentOptions | undefined
) => {
  const ai = getAIClient();
  const chatHistory = getOptimizedHistory(history);
  const currentParts: Part[] = [{ text: text }];
  
  if (options?.visual) {
    currentParts.push({
      inlineData: { mimeType: options.visual.mimeType, data: options.visual.data }
    });
  }

  const contents = [
    ...chatHistory,
    { role: "user", parts: currentParts }
  ];

  const systemInstruction = getDynamicInstruction(history, text);

  try {
    const chatModel = options?.model || GEMINI_MODEL;
    return await retryWithBackoff(async () => {
        const response = await ai.models.generateContent({
          model: chatModel,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7, 
          },
          contents: contents
        });
        return response.text || "I'm listening...";
    }, chatModel);
  } catch (error) {
    throw wrapGenAIError(error);
  }
};
