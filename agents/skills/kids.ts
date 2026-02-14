
import { Skill, SkillContext } from "./types";
import { SYSTEM_INSTRUCTION_KIDS_EXPERT } from "../../prompts";

export const KidsSkill: Skill = {
    id: "kids_expert",
    name: "Kids Viral Architect",
    description: "Optimizes for children's attention spans, repetition, and educational hooks.",
    coreInstruction: SYSTEM_INSTRUCTION_KIDS_EXPERT,
    activator: (context: SkillContext) => {
        const s = context.settings;
        return (
            s.category.toLowerCase().includes("kids") ||
            s.theme.toLowerCase().includes("kids") ||
            s.style.toLowerCase().includes("nursery") ||
            s.style.toLowerCase().includes("lullaby") ||
            ["rhyme", "baby", "child", "toddler"].some(t => context.userRequest.toLowerCase().includes(t))
        );
    }
};
