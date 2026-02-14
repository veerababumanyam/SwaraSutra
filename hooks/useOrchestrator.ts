
import { useState } from "react";
import { AgentStatus, AgentStep, Message, LanguageProfile, GenerationSettings, AgentType, AudioAnalysisResult, ComplianceReport } from "../types";
import { runMultiModalAgent } from "../agents/multimodal";
import { runStrategyAndLyricistAgent } from "../agents/strategyLyricist";
import { runComplianceAgent } from "../agents/compliance";
import { runReviewAgent } from "../agents/review";
import { runFormatterAgent } from "../agents/formatter";
import { runPostProcessAgent } from "../agents/postProcessor";
import { runAudioAnalysisAgent } from "../agents/audioAnalyst";
import { useStudio } from "../contexts/StudioContext";
import { MIN_INTER_CALL_DELAY_MS } from "../constants";
import { SCENARIO_KNOWLEDGE_BASE } from "../knowledgeBase";
import { sleep } from "../utils";
import { workflowController, WorkflowCanceledError } from "../workflows/workflowController";

export const useOrchestrator = () => {
  const { appearance } = useStudio();
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    active: false,
    currentAgent: "ORCHESTRATOR",
    message: "Ready.",
    steps: []
  });

  const updateStatus = (agent: AgentType, message: string, steps: AgentStep[]) => {
    setAgentStatus({ active: true, currentAgent: agent, message, steps });
  };

  const runSongGenerationWorkflow = async (
    userRequest: string,
    languageProfile: LanguageProfile,
    generationSettings: GenerationSettings,
    addMessage: (msg: Message) => void,
    updateMessage: (id: string, content: Partial<Message>) => void,
    visual?: { data: string, mimeType: string, type: 'image' | 'video' },
    audio?: { data: string, mimeType: string, fileName?: string },
    rhythmContext?: string
  ) => {
    const initialSteps: AgentStep[] = [
      ...(visual ? [{ id: "vision", label: "Visual Scan", status: "pending" as const }] : []),
      ...(audio ? [{ id: "audio", label: "Audio Scan", status: "pending" as const }] : []),
      { id: "strategy", label: "Strategy Blueprint", status: "pending" },
      { id: "lyricist", label: "Writing Lyrics", status: "pending" },
      { id: "compliance", label: "Compliance Check", status: "pending" },
      { id: "review", label: "Peer Review", status: "pending" },
      { id: "formatting", label: "Suno Formatting", status: "pending" }
    ];

    setAgentStatus({ active: true, currentAgent: "ORCHESTRATOR", message: "Queued...", steps: initialSteps });

    const workflowKey = JSON.stringify({
      type: "song",
      text: userRequest,
      lang: languageProfile.primary,
      ceremony: generationSettings.ceremony || "",
      visual: visual ? `${visual.mimeType}:${visual.data.slice(0, 24)}` : "",
      audio: audio ? `${audio.mimeType}:${audio.data.slice(0, 24)}` : "",
      rhythm: rhythmContext || ""
    });

    return workflowController.start("song", workflowKey, async (run) => {
      // 1. Resolve Sutra (Knowledge Base Context)
      let sutraContext = "";
      if (generationSettings.ceremony) {
        for (const cat of SCENARIO_KNOWLEDGE_BASE) {
          const evt = cat.events.find(e => e.id === generationSettings.ceremony);
          if (evt) {
            sutraContext = `[SUTRA: ${evt.label}]\n${evt.promptContext}`;
            break;
          }
        }
      }

      let currentSteps = [...initialSteps];
      const setStepStatus = (id: string, status: AgentStep['status']) => {
        currentSteps = currentSteps.map(s => s.id === id ? { ...s, status } : s);
        return [...currentSteps];
      };

      setAgentStatus({ active: true, currentAgent: "ORCHESTRATOR", message: "Starting Pipeline...", steps: currentSteps });

      try {
        run.throwIfCanceled();
        // VISUAL
        let visualCtx = "";
        if (visual) {
          updateStatus("MULTIMODAL", "Analyzing Visuals...", setStepStatus("vision", "active"));
          visualCtx = await runMultiModalAgent(userRequest, visual, appearance.agentModels.MULTIMODAL);
          setStepStatus("vision", "completed");
          await sleep(MIN_INTER_CALL_DELAY_MS);
        }

        run.throwIfCanceled();
        // AUDIO
        let audioAnalysis: AudioAnalysisResult | undefined;
        if (audio) {
          updateStatus("AUDIO_ANALYST", "Analyzing Audio...", setStepStatus("audio", "active"));
          try {
            const raw = await runAudioAnalysisAgent(audio.data, audio.mimeType, appearance.agentModels.AUDIO_ANALYST);
            if (raw && !raw.includes("Failed")) audioAnalysis = JSON.parse(raw);
          } catch (e) { console.warn("Audio fail", e); }
          setStepStatus("audio", "completed");
          await sleep(MIN_INTER_CALL_DELAY_MS);
        }

        run.throwIfCanceled();
        // STRATEGY + LYRICIST (Combined single call — flash-first, pro fallback)
        updateStatus("RESEARCH", "Developing Strategy & Writing Lyrics...", setStepStatus("strategy", "active"));
        const { strategy: strategyResult, lyrics: draftLyrics } = await runStrategyAndLyricistAgent(
          `${visualCtx}\n${userRequest}`,
          generationSettings,
          languageProfile,
          appearance.agentModels.RESEARCH,  // flash (primary)
          appearance.agentModels.LYRICIST,  // pro (fallback)
          audioAnalysis,
          sutraContext,
          rhythmContext
        );
        updateStatus("RESEARCH", "Blueprint Ready.", setStepStatus("strategy", "completed"));
        updateStatus("LYRICIST", "Draft Complete.", setStepStatus("lyricist", "completed"));
        await sleep(MIN_INTER_CALL_DELAY_MS);

        run.throwIfCanceled();
        // POST-PROCESSING Pipeline (Combined)
        updateStatus("REVIEW", "Polishing & Formatting...", setStepStatus("review", "active"));
        let compliance: ComplianceReport;
        let reviewed: string;
        let formatted: { formattedLyrics: string; stylePrompt: string };

        try {
          const post = await runPostProcessAgent(
            draftLyrics,
            userRequest,
            languageProfile,
            generationSettings,
            appearance.agentModels.REVIEW
          );
          compliance = post.complianceReport;
          reviewed = post.reviewedLyrics;
          formatted = {
            formattedLyrics: post.formattedLyrics,
            stylePrompt: post.stylePrompt
          };
          setStepStatus("review", "completed");
          setStepStatus("compliance", "completed");
          setStepStatus("formatting", "completed");
        } catch (error) {
          console.warn("Post-processor failed, falling back to legacy pipeline", error);
          updateStatus("COMPLIANCE", "Checking...", setStepStatus("compliance", "active"));
          compliance = await runComplianceAgent(draftLyrics, appearance.agentModels.COMPLIANCE);
          setStepStatus("compliance", "completed");
          await sleep(MIN_INTER_CALL_DELAY_MS);

          updateStatus("REVIEW", "Polishing...", setStepStatus("review", "active"));
          reviewed = await runReviewAgent(draftLyrics, userRequest, languageProfile, generationSettings, appearance.agentModels.REVIEW);
          setStepStatus("review", "completed");
          await sleep(MIN_INTER_CALL_DELAY_MS);

          updateStatus("FORMATTER", "Formatting...", setStepStatus("formatting", "active"));
          formatted = await runFormatterAgent(reviewed, appearance.agentModels.FORMATTER);
          setStepStatus("formatting", "completed");
        }

        // Construct High-Quality Style Prompt from Strategy + Formatter
        // If Strategy has a high-quality style map, we prefer that, or compare/combine
        const finalStylePrompt = strategyResult.musicalArchitecture
          ? `${strategyResult.musicalArchitecture.fusionElement}, ${strategyResult.musicalArchitecture.vocalTexture}, ${strategyResult.musicalArchitecture.sunoTags}`
          : formatted.stylePrompt;

        // Final Message
        const msg: Message = {
          id: Date.now().toString(),
          role: "model",
          content: `Title: ${strategyResult.blueprint.title}\nNavarasa: ${strategyResult.navarasa}\n\n${reviewed}`,
          senderAgent: "ORCHESTRATOR",
          timestamp: new Date(),
          complianceReport: compliance,
          sunoFormattedContent: formatted.formattedLyrics,
          sunoStylePrompt: finalStylePrompt, // Enhanced Style Prompt
          lyricsData: {
            language: languageProfile.primary,
            structure: strategyResult.structure,
            dialect: strategyResult.directives.linguistic,
            navarasa: strategyResult.navarasa,
            sentiment: strategyResult.sentiment
          }
        };

        addMessage(msg);
        setAgentStatus(prev => ({ ...prev, active: false, message: "Done." }));

      } catch (error: any) {
        if (error instanceof WorkflowCanceledError) {
          setAgentStatus(prev => ({ ...prev, active: false, message: "Canceled." }));
          return;
        }
        console.error(error);
        const msg: Message = { id: Date.now().toString(), role: "system", content: `Error: ${error.message}`, timestamp: new Date() };
        addMessage(msg);
        setAgentStatus(prev => ({ ...prev, active: false, message: "Error." }));
      }
    }, { latestOnly: true, dedupeMs: 2000 });
  };

  return { agentStatus, runSongGenerationWorkflow };
};
