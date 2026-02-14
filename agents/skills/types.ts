
import { GenerationSettings, LanguageProfile, AudioAnalysisResult } from "../../types";

export interface SkillContext {
    userRequest: string;
    settings: GenerationSettings;
    language: LanguageProfile;
    audioAnalysis?: AudioAnalysisResult;
    sutraContext?: string; // Content from the selected Knowledge Base scenario
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    /**
     * coreInstruction: The "system prompt" or knowledge base for this skill.
     */
    coreInstruction: string;
    /**
     * activator: Logic to determine if this skill should be active for the current request.
     */
    activator: (context: SkillContext) => boolean;
    /**
     * Dynamic prompt generator (optional) if the instruction needs to be tailored at runtime
     */
    getInstruction?: (context: SkillContext) => string;
}
