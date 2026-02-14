
import { Skill, SkillContext } from "./types";
import { SYSTEM_INSTRUCTION_DEVOTIONAL_EXPERT } from "../../prompts";

export const DevotionalSkill: Skill = {
    id: "devotional_expert",
    name: "Bhakti (Devotional) Scholar",
    description: "Ensures scriptural accuracy, uses Grandhika Bhasha, and appropriate titles for Deities.",
    coreInstruction: SYSTEM_INSTRUCTION_DEVOTIONAL_EXPERT,
    activator: (context: SkillContext) => {
        const s = context.settings;
        return (
            s.theme.toLowerCase().includes("devotional") ||
            s.style.toLowerCase().includes("devotional") ||
            s.mood.toLowerCase().includes("devotional") ||
            s.mood.toLowerCase().includes("bhakti") ||
            s.category.toLowerCase().includes("divine") ||
            ["god", "lord", "goddess", "temple", "prayer"].some(t => context.userRequest.toLowerCase().includes(t))
        );
    }
};
