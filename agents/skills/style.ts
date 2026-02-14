
import { Skill, SkillContext } from "./types";
import { SYSTEM_INSTRUCTION_STYLE_AGENT } from "../../prompts";
import { DEFAULT_HQ_TAGS, GLOBAL_FUSION_STYLES } from "../../constants";

export const StyleSkill: Skill = {
    id: "sonic_alchemist",
    name: "Master Music Producer",
    description: "Defines the 'Tri-Layer Sonic Stack' (Native Root + Global Fusion + Immersive Quality).",
    coreInstruction: SYSTEM_INSTRUCTION_STYLE_AGENT,
    activator: (context: SkillContext) => true, // Always active to ensure high production value
    getInstruction: (context: SkillContext) => `
    ${SYSTEM_INSTRUCTION_STYLE_AGENT}

    ### CURRENT PRODUCTION CONTEXT:
    - **Native Root:** Identify instruments for "${context.language.primary}" and region "${context.settings.dialect || 'Standard'}".
    - **Target Vibe:** ${context.settings.style} mixed with ${context.settings.mood}.
    
    ### MANDATORY OUTPUT FORMAT (The Sonic Stack):
    You must output a specific "Style Map" including:
    1. **Primary Instruments** (e.g. Nadaswaram, Dholak).
    2. **Fusion Element** (Pick one from: ${GLOBAL_FUSION_STYLES.join(", ")}).
    3. **Vocal Texture** (e.g. Sufi, Rap, Carnatic).
    4. **Suno Tags** (Must include: ${DEFAULT_HQ_TAGS}).
  `
};
