
import { Skill, SkillContext } from "./types";
import { SYSTEM_INSTRUCTION_FOLK_EXPERT } from "../../prompts";

export const FolkSkill: Skill = {
    id: "folk_expert",
    name: "Janapada (Folk) Specialist",
    description: "Injects rural rhythms, onomatopoeia, and earthy metaphors.",
    coreInstruction: SYSTEM_INSTRUCTION_FOLK_EXPERT,
    activator: (context: SkillContext) => {
        const s = context.settings;
        return (
            s.style.toLowerCase().includes("folk") ||
            s.style.toLowerCase().includes("teenmaar") ||
            s.style.toLowerCase().includes("dappu") ||
            s.theme.toLowerCase().includes("rural") ||
            context.userRequest.toLowerCase().includes("folk")
        );
    },
    getInstruction: () => `
    ${SYSTEM_INSTRUCTION_FOLK_EXPERT}
    
    ### FOLK PROTOCOL:
    1. **Rhythm:** Use "Teenmaar" or "Dappu" text-rhythms.
    2. **Sound FX:** Add onomatopoeia like "Dhum Dhum", "Ghallu Ghallu".
    3. **Vocab:** Use rustic, village-level dialect words (Palle Padalu).
  `
};
