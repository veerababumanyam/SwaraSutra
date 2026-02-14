
import { Skill, SkillContext } from "./types";
import { RESEARCH_PROMPT_TEMPLATE } from "../../prompts";

export const ResearchSkill: Skill = {
    id: "researcher",
    name: "Cultural Researcher",
    description: "Extracts cultural metaphors, idioms, and context relevant to the topic.",
    coreInstruction: "You are the Cultural Librarian. Provide metaphors and context.",
    activator: (context: SkillContext) => true, // Always active
    getInstruction: (context: SkillContext) => `
    ### RESEARCH TASK:
    ${RESEARCH_PROMPT_TEMPLATE(context.userRequest, context.settings.mood, context.settings.dialect)}
    
    1. **Metaphors:** Provide 3-5 unique metaphors for "${context.settings.mood}" in the context of "${context.settings.theme}".
    2. **Idioms:** Suggest local idioms if Dialect is active.
    3. **Trend Check:** If the topic is modern, suggest current slang trends.
  `
};
