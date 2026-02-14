
import { Type, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_CRITICS_SWARM } from "../prompts";
import { retryWithBackoff, wrapGenAIError, getAIClient, cleanAndParseJSON } from "../utils";
import { GEMINI_MODEL_QUALITY } from "../constants";
import { VidwanSkill, TrendZSkill, SahityaSkill, HitMakerSkill } from "./skills/critics";
import { SkillContext } from "./skills/types";

export interface CriticReview {
  persona: string;
  verdict: "Approve" | "Reject" | "Needs Polish";
  critique: string;
}

export interface CriticsConsensus {
  debateSummary: CriticReview[];
  consensusPlan: string;
  finalVerdict: "Ready" | "Rewrite";
}

export const runCriticsSwarm = async (
  draftLyrics: string,
  context: string,
  model: string = GEMINI_MODEL_QUALITY
): Promise<CriticsConsensus> => {
  const ai = getAIClient();

  // Mock Context for Activators (In a real scenario, we'd pass full context, but for simple rewrite, we assume broad activation)
  const mockContext: SkillContext = {
    userRequest: context,
    settings: {
      style: context,
      theme: context,
      mood: "Neutral",
      complexity: "Complex",
      category: "General",
      ceremony: "", customTheme: "", customMood: "", customStyle: "", rhymeScheme: "AABB", customRhymeScheme: "", singerStyle: "", customSingerStyle: "", structure: "", customStructure: "", dialect: "", customDialect: ""
    },
    language: { primary: "Telugu", secondary: "English", tertiary: "Hindi" }
  };

  const availableCritics = [VidwanSkill, TrendZSkill, SahityaSkill, HitMakerSkill];

  // Filter active critics (or just use all for a robust review)
  // For the "Swarm", we usually want everyone to weigh in unless it's very specific.
  // Let's activate all for maximum coverage in the "Council".
  const activeCritics = availableCritics;

  let criticPersonas = "";
  activeCritics.forEach(skill => {
    criticPersonas += `\n--- [COUNCIL MEMBER: ${skill.name}] ---\n${skill.coreInstruction}\n`;
  });

  const swarmSchema = {
    type: Type.OBJECT,
    properties: {
      debateSummary: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            persona: { type: Type.STRING },
            verdict: { type: Type.STRING, enum: ["Approve", "Reject", "Needs Polish"] },
            critique: { type: Type.STRING }
          },
          required: ["persona", "verdict", "critique"]
        }
      },
      consensusPlan: {
        type: Type.STRING,
        description: "The final detailed instruction for the Lyricist to rewrite the song. Merges all feedback."
      },
      finalVerdict: { type: Type.STRING, enum: ["Ready", "Rewrite"] }
    },
    required: ["debateSummary", "consensusPlan", "finalVerdict"]
  };

  const prompt = `
    ### DRAFT LYRICS TO REVIEW:
    ${draftLyrics}

    ### SONG CONTEXT:
    ${context}

    ### THE HIGH COUNCIL (Active Personas):
    ${criticPersonas}

    ### TASK:
    Initiate the High Council Debate.
    Each active Council Member must analyze the draft based on their SPECIFIC focus area.
    They must find flaws in meter, slang, structure, or emotion according to their persona.
    They must argue and then agree on a consensus.

    Output the debate summary (one entry per active member) and the FINAL INSTRUCTION for the Lyricist.
  `;

  try {
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CRITICS_SWARM,
        responseMimeType: "application/json",
        responseSchema: swarmSchema,
        temperature: 0.8
      }
    }), model) as GenerateContentResponse;

    if (response.text) {
      return cleanAndParseJSON<CriticsConsensus>(response.text);
    }

    throw new Error("Critics Swarm remained silent.");
  } catch (error) {
    throw wrapGenAIError(error);
  }
};