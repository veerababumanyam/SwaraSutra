
import { Type } from "@google/genai";
import { retryWithBackoff, wrapGenAIError, getAIClient, GeminiError, cleanAndParseJSON } from "../utils";
import { GEMINI_MODEL_QUALITY } from "../constants";
import { GenerationSettings, LanguageProfile, AudioAnalysisResult } from "../types";
import { Skill, SkillContext } from "./skills/types";

// Import Skills
import { RegionalSkill } from "./skills/regional";
import { FolkSkill } from "./skills/folk";
import { DevotionalSkill } from "./skills/devotional";
import { KidsSkill } from "./skills/kids";
import { ResearchSkill } from "./skills/research";
import { StyleSkill } from "./skills/style"; // NEW

export interface StrategyResult {
    navarasa: string;
    sentiment: string;
    structure: string;
    blueprint: {
        title: string;
        hookLine: string;
        sectionsOutline: string[];
    };
    directives: {
        linguistic: string;
        cultural: string;
        musical: string;
    };
    musicalArchitecture: { // NEW: From Style Skill
        primaryInstruments: string[];
        fusionElement: string;
        vocalTexture: string;
        sunoTags: string;
    };
    researchInsights: string[];
}

export const runStrategyAgent = async (
    userRequest: string,
    settings: GenerationSettings,
    language: LanguageProfile,
    model: string = GEMINI_MODEL_QUALITY,
    audioAnalysis?: AudioAnalysisResult,
    sutraContext?: string
): Promise<StrategyResult> => {
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
        StyleSkill // NEW
    ];

    // Logic: Filter active skills based on context
    const activeSkills = availableSkills.filter(skill => skill.activator(context));

    // Build the Mega-Prompt
    let systemMsg = `You are the Lead Music Strategy Architect. Synthesize user requirements into a Song Blueprint.`;

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

    const resolvedTheme     = resolve(settings.theme, settings.customTheme);
    const resolvedStructure = resolve(settings.structure, settings.customStructure);
    const resolvedRhyme     = resolve(settings.rhymeScheme, settings.customRhymeScheme);
    const resolvedComplexity = resolve(settings.complexity);
    const resolvedSinger    = resolve(settings.singerStyle, settings.customSingerStyle);
    const resolvedDialect   = resolve(settings.dialect, settings.customDialect);
    const resolvedMood      = resolve(settings.mood, settings.customMood);
    const resolvedStyle     = resolve(settings.style, settings.customStyle);

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

    ### ACTIVE EXPERT PROTOCOLS (You must synthesize these):
    ${skillInstructions}

    ### TASK:
    Analyze the request and the active protocols. Produce a JSON Blueprint that the "Lyricist" agent will use to write the actual song.
    
    1. **Navarasa/Sentiment:** Detect the core emotion.
    2. **Structure:** Define the song structure (Verse-Chorus-etc.).${resolvedStructure ? ` The user has selected: "${resolvedStructure}" — you MUST use this structure.` : ""}
    3. **Directives:** Summarize the linguistic and cultural rules into clear instructions.
    4. **Musical Architecture:** Define the instruments, fusion, and vocal style (from the Producer/Style expert).
    5. **Blueprint:** Provide a title, hook idea, and outline.
    
    Output strictly in JSON.
  `;

    // Define Schema
    const strategySchema = {
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
            musicalArchitecture: { // NEW
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
            }
        },
        required: ["navarasa", "sentiment", "structure", "blueprint", "directives", "musicalArchitecture", "researchInsights"]
    };

    try {
        const response = await retryWithBackoff(async () => await ai.models.generateContent({
            model: model,
            contents: finalPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: strategySchema,
                temperature: 0.5
            }
        }), model);

        if (!response.text) throw new GeminiError("Strategy Agent returned empty response.", 'SERVER');
        return cleanAndParseJSON<StrategyResult>(response.text);

    } catch (error) {
        throw wrapGenAIError(error);
    }
};
