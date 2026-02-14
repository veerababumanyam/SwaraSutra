
import { useState } from "react";
import { getAIClient, retryWithBackoff, wrapGenAIError } from "../utils";
import { GEMINI_MODEL } from "../constants";
import { runStyleAgent } from "../agents/style";
import { runArtAgent } from "../agents/art";
import { runCriticsSwarm } from "../agents/critics";
import { runLyricistRewrite } from "../agents/lyricist";
import { useStudio } from "../contexts/StudioContext";
import { workflowController, WorkflowCanceledError } from "../workflows/workflowController";

export const useLyricsActions = (
  editableContent: string,
  setEditableContent: (s: string) => void,
  metadata: { title?: string, music?: string, language?: string }
) => {
  const { appearance, languageSettings, generationSettings } = useStudio();
  const [isFixingRhyme, setIsFixingRhyme] = useState(false);
  const [isEnhancingStyle, setIsEnhancingStyle] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(null);

  const handleMagicRhymeFix = async () => {
    if (!editableContent.trim()) return;
    setIsFixingRhyme(true);
    const originalContent = editableContent;

    const actionKey = `magic-rhyme:${originalContent.slice(0, 160)}`;
    return workflowController.start("editor", actionKey, async (run) => {
      try {
        run.throwIfCanceled();
        const ai = getAIClient();
        const rhymeModel = appearance.agentModels.REVIEW || GEMINI_MODEL;
        const response = await retryWithBackoff(async () => await ai.models.generateContent({
          model: rhymeModel,
          contents: `Review the following song lyrics. Identify lines that have weak rhymes (Anthya Prasa). Rewrite ONLY those specific lines to have better rhyming endings while keeping the same meaning and native script. Output the FULL improved lyrics. \n\n ${originalContent}`
        }), rhymeModel);

        if (response.text) {
          const newContent = response.text;
          setEditableContent(newContent);
          return true;
        }
      } catch (e) {
        if (e instanceof WorkflowCanceledError) return false;
        const err = wrapGenAIError(e);
        console.error("Rhyme Optimization Failed:", err);
        alert(`Optimization Failed: ${err.message}`);
      } finally {
        setIsFixingRhyme(false);
      }
      return false;
    }, { latestOnly: true, dedupeMs: 1500 });
  };

  const handleEnhanceStyle = async (currentStyle: string) => {
    setIsEnhancingStyle(true);
    const actionKey = `enhance-style:${currentStyle}:${editableContent.slice(0, 120)}`;
    return workflowController.start("editor", actionKey, async (run) => {
      try {
        run.throwIfCanceled();
        const context = `
        Language: ${languageSettings.primary}
        Mood: ${generationSettings.mood || 'Cinematic'}
        Lyrics:
        ${editableContent}
      `;
        // Use the FORMATTER agent model for style enhancement tasks
        return await runStyleAgent(currentStyle, context, appearance.agentModels.FORMATTER);
      } catch (e) {
        if (e instanceof WorkflowCanceledError) return currentStyle;
        const err = wrapGenAIError(e);
        console.error("Style Enhancement Failed:", err);
        alert(`Style Enhancement Failed: ${err.message}`);
        return currentStyle;
      } finally {
        setIsEnhancingStyle(false);
      }
    }, { latestOnly: true, dedupeMs: 1500 });
  };

  const handleGenerateArt = async (lyricsLines: string[]) => {
    if (lyricsLines.length === 0) return;
    setIsGeneratingArt(true);
    const actionKey = `generate-art:${lyricsLines.join(" ").slice(0, 120)}`;
    return workflowController.start("editor", actionKey, async (run) => {
      try {
        run.throwIfCanceled();
        const url = await runArtAgent(
          metadata.title || "Song",
          lyricsLines.join(" ").substring(0, 500),
          "Cinematic, " + (metadata.music || "Musical"),
          appearance.agentModels.ART
        );
        if (url) setCoverArtUrl(url);
      } catch (e) {
        if (e instanceof WorkflowCanceledError) return;
        const err = wrapGenAIError(e);
        console.error("Art Generation Failed:", err);
        alert(`Art Generation Failed: ${err.message}`);
      } finally {
        setIsGeneratingArt(false);
      }
    }, { latestOnly: true, dedupeMs: 1500 });
  };

  const handleCriticsRewrite = async () => {
    if (!editableContent.trim()) return;
    setIsReviewing(true);
    const actionKey = `critics-rewrite:${editableContent.slice(0, 160)}`;
    return workflowController.start("editor", actionKey, async (run) => {
      try {
        run.throwIfCanceled();
        // 1. Get Consensus
        const criticsResult = await runCriticsSwarm(
          editableContent,
          `Song Title: ${metadata.title}, Context: Rewriting existing draft.`,
          appearance.agentModels.CRITICS
        );

        // 2. Apply Rewrite
        // Construct a temporary language profile based on metadata or settings
        const langProfile = {
          primary: metadata.language || languageSettings.primary,
          secondary: languageSettings.secondary,
          tertiary: languageSettings.tertiary
        };

        const rewrittenLyrics = await runLyricistRewrite(
          criticsResult.consensusPlan, // Critique feedback
          editableContent, // Existing lyrics
          langProfile,
          appearance.agentModels.LYRICIST
        );

        if (rewrittenLyrics) {
          setEditableContent(rewrittenLyrics);
        }

      } catch (e) {
        if (e instanceof WorkflowCanceledError) return;
        const err = wrapGenAIError(e);
        console.error("Critics Rewrite Failed:", err);
        alert(`Critics Council Failed: ${err.message}`);
      } finally {
        setIsReviewing(false);
      }
    }, { latestOnly: true, dedupeMs: 1500 });
  };

  return {
    isFixingRhyme,
    handleMagicRhymeFix,
    isEnhancingStyle,
    handleEnhanceStyle,
    isGeneratingArt,
    handleGenerateArt,
    isReviewing,
    handleCriticsRewrite,
    coverArtUrl,
    setCoverArtUrl
  };
};
