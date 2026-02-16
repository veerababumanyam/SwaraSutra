
import { Type } from "@google/genai";
import { retryWithBackoff, wrapGenAIError, getAIClient, GeminiError, cleanAndParseJSON } from "../utils";
import { GEMINI_MODEL_QUALITY, GEMINI_MODEL } from "../constants";
import { GenerationSettings, LanguageProfile, AudioAnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION_LYRICIST } from "../prompts";
import { Skill, SkillContext } from "./skills/types";
import { StrategyResult } from "./strategy";

// Import Skills
import { RegionalSkill } from "./skills/regional";
import { FolkSkill } from "./skills/folk";
import { DevotionalSkill } from "./skills/devotional";
import { KidsSkill } from "./skills/kids";
import { ResearchSkill } from "./skills/research";
import { StyleSkill } from "./skills/style";

export interface StrategyAndLyricsResult {
    strategy: StrategyResult;
    lyrics: string;
}

/**
 * Combined Strategy + Lyricist agent: produces the song blueprint AND full lyrics
 * in a single model call, cutting 2 sequential API requests down to 1.
 */
export const runStrategyAndLyricistAgent = async (
    userRequest: string,
    settings: GenerationSettings,
    language: LanguageProfile,
    model: string = GEMINI_MODEL,
    fallbackModel: string = GEMINI_MODEL_QUALITY,
    audioAnalysis?: AudioAnalysisResult,
    sutraContext?: string,
    rhythmContext?: string
): Promise<StrategyAndLyricsResult> => {
    const ai = getAIClient();

    const context: SkillContext = {
        userRequest,
        settings,
        language,
        audioAnalysis,
        sutraContext
    };

    const availableSkills: Skill[] = [
        RegionalSkill,
        ResearchSkill,
        FolkSkill,
        DevotionalSkill,
        KidsSkill,
        StyleSkill
    ];

    const activeSkills = availableSkills.filter(skill => skill.activator(context));

    // Build the combined mega-prompt
    let systemMsg = `You are the Lead Music Strategy Architect AND the Mahakavi (Great Poet).
Your job has TWO phases that you execute in ONE response:
  PHASE 1 — Develop the Strategy Blueprint (song structure, directives, musical architecture).
  PHASE 2 — Using that Blueprint, write the FULL lyrics in ${language.primary} native script.`;

    if (sutraContext) {
        systemMsg += `\n\n### SUTRA ENGINE CONTEXT (Knowledge Base):\n${sutraContext}`;
    }
    if (audioAnalysis) {
        systemMsg += `\n\n### AUDIO ANALYSIS:\n${audioAnalysis.syllableBlueprint}`;
    }

    let skillInstructions = "";
    activeSkills.forEach(skill => {
        const instruction = skill.getInstruction ? skill.getInstruction(context) : skill.coreInstruction;
        skillInstructions += `\n--- [Active Expert: ${skill.name}] ---\n${instruction}\n`;
    });

    // Resolve custom values, skip "Auto" settings
    const AUTO = "Auto (AI Detect)";
    const resolve = (val: string, custom?: string) =>
        val === "Custom" && custom ? custom : (val && val !== AUTO ? val : "");

    const resolvedTheme = resolve(settings.theme, settings.customTheme);
    const resolvedStructure = resolve(settings.structure, settings.customStructure);
    const resolvedRhyme = resolve(settings.rhymeScheme, settings.customRhymeScheme);
    const resolvedComplexity = resolve(settings.complexity);
    const resolvedSinger = resolve(settings.singerStyle, settings.customSingerStyle);
    const resolvedDialect = resolve(settings.dialect, settings.customDialect);
    const resolvedMood = resolve(settings.mood, settings.customMood);
    const resolvedStyle = resolve(settings.style, settings.customStyle);

    const finalPrompt = `
    ${systemMsg}

    ### USER REQUEST: "${userRequest}"
    - Mood: ${resolvedMood || "Auto (AI Detect)"}
    - Style: ${resolvedStyle || "Auto (AI Detect)"}
    - Language: ${language.primary}
    ${resolvedTheme ? `- Theme: ${resolvedTheme}` : ""}
    ${resolvedStructure ? `- Song Structure: ${resolvedStructure} (MUST follow this structure)` : ""}
    ${resolvedRhyme ? `- Rhyme Scheme: ${resolvedRhyme}` : ""}
    ${resolvedComplexity ? `- Complexity: ${resolvedComplexity}` : ""}
    ${resolvedSinger ? `- Singer Style: ${resolvedSinger}` : ""}
    ${resolvedDialect ? `- Dialect: ${resolvedDialect}` : ""}
    ${rhythmContext ? `- Rhythm Context: ${rhythmContext}` : ""}

    ### ACTIVE EXPERT PROTOCOLS (You must synthesize these):
    ${skillInstructions}

    ============================================================
    PHASE 1 — STRATEGY BLUEPRINT
    ============================================================
    Analyze the request and the active protocols. Produce the Strategy fields:
    1. **Navarasa/Sentiment:** Detect the core emotion.
    2. **Structure:** Define the song structure (Verse-Chorus-etc.).${resolvedStructure ? ` The user has selected: "${resolvedStructure}" — you MUST use this structure.` : ""}
    3. **Directives:** Summarize the linguistic and cultural rules into clear instructions.
    4. **Musical Architecture:** Define the instruments, fusion, and vocal style.
    5. **Blueprint:** Provide a title, hook idea, and outline.

    ============================================================
    PHASE 2 — LYRICS (Using the Blueprint above)
    ============================================================
    ${SYSTEM_INSTRUCTION_LYRICIST}

    Write the FULL lyrics following the Blueprint you created in Phase 1.
    - Language: ${language.primary} (MANDATORY NATIVE SCRIPT).
    - Follow the structure, directives, and hook from Phase 1.
    - Incorporate the research insights as metaphors/imagery.

    ============================================================
    OUTPUT: Return a single JSON object with ALL the strategy fields AND a "lyrics" string field containing the full lyrics text.
  `;

    const combinedSchema = {
        type: Type.OBJECT,
        properties: {
            navarasa: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            structure: { type: Type.STRING },
            blueprint: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    hookLine: { type: Type.STRING },
                    sectionsOutline: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["title", "hookLine", "sectionsOutline"]
            },
            directives: {
                type: Type.OBJECT,
                properties: {
                    linguistic: { type: Type.STRING },
                    cultural: { type: Type.STRING },
                    musical: { type: Type.STRING }
                },
                required: ["linguistic", "cultural", "musical"]
            },
            musicalArchitecture: {
                type: Type.OBJECT,
                properties: {
                    primaryInstruments: { type: Type.ARRAY, items: { type: Type.STRING } },
                    fusionElement: { type: Type.STRING },
                    vocalTexture: { type: Type.STRING },
                    sunoTags: { type: Type.STRING }
                },
                required: ["primaryInstruments", "fusionElement", "vocalTexture", "sunoTags"]
            },
            researchInsights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            lyrics: { type: Type.STRING }
        },
        required: ["navarasa", "sentiment", "structure", "blueprint", "directives", "musicalArchitecture", "researchInsights", "lyrics"]
    };

    try {
        const response = await retryWithBackoff(async () => await ai.models.generateContent({
            model: model,
            contents: finalPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: combinedSchema,
                temperature: 0.6
            }
        }), model);

        if (!response.text) throw new GeminiError("Strategy+Lyricist Agent returned empty response.", 'SERVER');

        const parsed = cleanAndParseJSON<StrategyResult & { lyrics: string }>(response.text);

        // Validate: lyrics must be non-trivial
        if (!parsed.lyrics || parsed.lyrics.trim().length < 50) {
            throw new GeminiError("Output too short or missing lyrics — falling back to pro.", 'PARSING');
        }

        const { lyrics, ...strategyFields } = parsed;

        return {
            strategy: strategyFields as StrategyResult,
            lyrics
        };

    } catch (error: any) {
        // If the primary model failed and we have a different fallback model, try it
        if (fallbackModel && fallbackModel !== model) {
            console.warn(`LayaVani: Primary model (${model}) failed, falling back to ${fallbackModel}:`, error?.message?.slice(0, 80));
            try {
                const response = await retryWithBackoff(async () => await ai.models.generateContent({
                    model: fallbackModel,
                    contents: finalPrompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: combinedSchema,
                        temperature: 0.6
                    }
                }), fallbackModel);

                if (!response.text) throw new GeminiError("Fallback Strategy+Lyricist returned empty.", 'SERVER');

                const parsed = cleanAndParseJSON<StrategyResult & { lyrics: string }>(response.text);
                const { lyrics, ...strategyFields } = parsed;

                return {
                    strategy: strategyFields as StrategyResult,
                    lyrics
                };
            } catch (fallbackError) {
                throw wrapGenAIError(fallbackError);
            }
        }
        throw wrapGenAIError(error);
    }
};
