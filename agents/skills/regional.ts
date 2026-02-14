
import { Skill, SkillContext } from "./types";
import { SYSTEM_INSTRUCTION_REGIONAL_EXPERT } from "../../prompts";
import { AUTO_OPTION } from "../../constants";

export const RegionalSkill: Skill = {
    id: "regional_guardian",
    name: "Regional & Linguistic Guardian",
    description: "Enforces native script usage, dialect rules, and poetic meters (Chandassu).",
    coreInstruction: SYSTEM_INSTRUCTION_REGIONAL_EXPERT,
    activator: (context: SkillContext) => {
        // Always active to enforce language rules
        return true;
    },
    getInstruction: (context: SkillContext) => {
        const lang = context.language.primary;
        const dialect = context.settings.dialect !== "Custom" && context.settings.dialect !== AUTO_OPTION
            ? context.settings.dialect
            : "Standard";

        return `
    ${SYSTEM_INSTRUCTION_REGIONAL_EXPERT}
    
    ### CURRENT SESSION MANDATES:
    - **TARGET LANGUAGE:** ${lang} (Script enforcement is non-negotiable).
    - **DIALECT:** ${dialect}.
    - **POETIC METER:** If ${lang} is Dravidian, enforce Prasa (2nd letter rhyme).
    `;
    }
};
