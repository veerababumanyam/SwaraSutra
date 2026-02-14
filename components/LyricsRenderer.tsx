
import React, { useState, useEffect, useRef } from "react";
import { Copy, Eye, Loader2, Download, Printer, Share2, Edit3, Wand2, CheckCircle2, Bookmark, Image as ImageIcon2, FileCode, Mic, StopCircle, Maximize2, Minimize2, Users } from "lucide-react";
import { useLyricsActions } from "../hooks/useLyricsActions";
import { LyricsViewer } from "./lyrics/LyricsViewer";
import { LyricsEditor } from "./lyrics/LyricsEditor";
import { SunoExportPanel } from "./lyrics/SunoExportPanel";
import { parseLyricsToSections, generatePDF, cn } from "../utils";
import { runTTSAgent } from "../agents/tts";
import { useStudio } from "../contexts/StudioContext";
import { AudioWaveform } from "./ui/AudioWaveform";

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  activeColorClass?: string;
}

const TabButton = ({ icon, label, active, onClick, activeColorClass = "text-primary" }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200",
      active
        ? `bg-white dark:bg-slate-800 shadow-sm ${activeColorClass} ring-1 ring-black/5 dark:ring-white/10`
        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
    )}
  >
    {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: cn("w-4 h-4", active ? "opacity-100" : "opacity-70") })}
    <span>{label}</span>
  </button>
);

const ActionButton = ({ icon, label, onClick, disabled, title, active }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean, title?: string, active?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "flex flex-col items-center gap-2 p-2 rounded-xl transition-all w-20 shrink-0 min-w-[44px] min-h-[44px] group",
      disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
    )}
  >
    <div className={cn(
      "p-3 rounded-full shadow-sm border transition-all duration-300",
      active
        ? "bg-primary text-white border-primary/50 scale-110"
        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 group-hover:border-primary/50 group-hover:text-primary"
    )}>
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: cn("w-5 h-5", active && "animate-pulse") })}
    </div>
    <span className="text-[11px] font-bold uppercase tracking-wider text-center leading-none text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
      {label}
    </span>
  </button>
);

const renderStyledLine = (line: string) => {
  const parts = line.split(/(\[(?:Male|Female|Both|Chorus|Verse|Pre-Chorus|Bridge|Hook|Intro|Outro|Instrumental|Child|Group|Duet|Big Chorus|Drop|Build Up|Solo|Guitar|Spoken|Whisper).*?\])/gi);
  return (
    <span>
      {parts.map((part, index) => {
        const isTag = part.startsWith('[') && part.endsWith(']');
        if (isTag) {
          let colorClass = "text-muted-foreground font-medium";
          const p = part.toLowerCase();
          if (p.includes("male")) colorClass = "text-blue-500 font-semibold";
          if (p.includes("female")) colorClass = "text-pink-500 font-semibold";
          if (p.includes("chorus")) colorClass = "text-amber-600 font-bold bg-amber-500/10 px-1 rounded";
          if (p.includes("verse")) colorClass = "text-sky-600 font-bold";
          if (p.includes("bridge")) colorClass = "text-purple-600 font-bold";
          if (p.includes("intro") || p.includes("outro")) colorClass = "text-emerald-700 dark:text-emerald-400 font-mono text-xs";
          return <span key={index} className={`mx-1 ${colorClass}`}>{part}</span>;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export const LyricsRenderer = ({
  content,
  sunoContent,
  sunoStylePrompt,
  onSave
}: {
  content: string,
  sunoContent?: string,
  sunoStylePrompt?: string,
  onSave?: (data: any) => void
}) => {
  const [viewMode, setViewMode] = useState<'PRETTY' | 'EDIT' | 'SUNO'>('PRETTY');
  const [editableContent, setEditableContent] = useState(content);
  const [localStylePrompt, setLocalStylePrompt] = useState(sunoStylePrompt || "");
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);
  const [ttsAudioData, setTtsAudioData] = useState<string | null>(null);


  const { appearance, setIsSidebarOpen, isCinemaMode, setIsCinemaMode } = useStudio();
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => { setEditableContent(content); }, [content]);
  useEffect(() => { if (sunoStylePrompt) setLocalStylePrompt(sunoStylePrompt); }, [sunoStylePrompt]);
  useEffect(() => { if (saveStatus === 'saved') setTimeout(() => setSaveStatus('idle'), 2000); }, [saveStatus]);

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch (e) { }
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  const lines = editableContent.split('\n');
  const metadata: Record<string, string> = {};
  const lyricsLines: string[] = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('Title:')) metadata.title = trimmed.replace('Title:', '').trim();
    else if (trimmed.startsWith('Hook:')) metadata.hookLine = trimmed.replace('Hook:', '').trim();
    else if (trimmed.startsWith('Language:')) metadata.language = trimmed.replace('Language:', '').trim();
    else if (trimmed.startsWith('Dialect:')) metadata.dialect = trimmed.replace('Dialect:', '').trim();
    else if (trimmed.startsWith('Raagam:')) metadata.music = trimmed.replace('Raagam:', '').trim();
    else if (trimmed.startsWith('Taalam:')) metadata.taalam = trimmed.replace('Taalam:', '').trim();
    else if (trimmed.startsWith('Structure:')) metadata.structure = trimmed.replace('Structure:', '').trim();
    else if (trimmed.startsWith('Navarasa:')) metadata.navarasa = trimmed.replace('Navarasa:', '').trim();
    else if (trimmed.startsWith('Sentiment:')) metadata.sentiment = trimmed.replace('Sentiment:', '').trim();
    else if (trimmed) lyricsLines.push(trimmed);
  });

  const sections = parseLyricsToSections(editableContent);

  const {
    isFixingRhyme, handleMagicRhymeFix,
    isEnhancingStyle, handleEnhanceStyle,
    isGeneratingArt, handleGenerateArt,
    isReviewing, handleCriticsRewrite,
    coverArtUrl, setCoverArtUrl
  } = useLyricsActions(editableContent, setEditableContent, metadata);

  const handleSaveLibrary = () => {
    if (onSave) {
      onSave({ title: metadata.title || "Untitled", content: editableContent, sunoContent, sunoStylePrompt: localStylePrompt });
      setSaveStatus('saved');
    }
  };

  const handleRecite = async () => {
    if (ttsAudioData) {
      return;
    }

    setIsGeneratingTTS(true);
    try {
      const cleanText = lyricsLines.join("\n").substring(0, 1500);
      const audioDataBase64 = await runTTSAgent(cleanText, 'Kore', appearance.agentModels.TTS);
      if (audioDataBase64) {
        setTtsAudioData(audioDataBase64);
      }
    } catch (error) {
      console.error("TTS Playback Error:", error);
      alert("Failed to recite lyrics.");
    } finally {
      setIsGeneratingTTS(false);
    }
  };

  const toggleCinemaMode = () => {
    const newMode = !isCinemaMode;
    setIsCinemaMode(newMode);
    if (newMode) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={cn(
      "relative rounded-xl overflow-visible shadow-sm my-4 w-full flex flex-col transition-all",
      isCinemaMode ? "fixed inset-0 z-50 bg-slate-950 m-0 rounded-none border-none" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
    )}>

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md shrink-0 gap-2 sm:gap-0">
        <div className="flex bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-xl gap-1">
          <TabButton
            icon={<Eye />}
            label="Preview"
            active={viewMode === 'PRETTY'}
            onClick={() => setViewMode('PRETTY')}
            activeColorClass="text-sky-500 dark:text-sky-400"
          />
          <TabButton
            icon={<Edit3 />}
            label="Studio"
            active={viewMode === 'EDIT'}
            onClick={() => setViewMode('EDIT')}
            activeColorClass="text-amber-500 dark:text-amber-400"
          />
          {sunoContent && (
            <TabButton
              icon={<FileCode />}
              label="Export"
              active={viewMode === 'SUNO'}
              onClick={() => setViewMode('SUNO')}
              activeColorClass="text-purple-500 dark:text-purple-400"
            />
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-0 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide w-full sm:w-auto flex-nowrap">
          {/* Audio Waveform takes center stage if TTS exists */}
          {ttsAudioData ? (
            <div className="flex-1 px-4 min-w-[200px]">
              <AudioWaveform audioData={ttsAudioData} mimeType="audio/mp3" />
            </div>
          ) : (
            <ActionButton
              icon={isGeneratingTTS ? <Loader2 className="animate-spin" /> : <Mic />}
              label={isGeneratingTTS ? "Dhwani..." : "Dhwani"}
              onClick={handleRecite}
              disabled={isGeneratingTTS}
              title="Recite Lyrics (TTS)"
            />
          )}

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

          <ActionButton
            icon={isReviewing ? <Loader2 className="animate-spin" /> : <Users />}
            label="Council"
            onClick={handleCriticsRewrite}
            disabled={isReviewing}
            title="Swarm Critics Review & Rewrite"
          />
          <ActionButton
            icon={isFixingRhyme ? <Loader2 className="animate-spin" /> : <Wand2 />}
            label="Prasa Fix"
            onClick={handleMagicRhymeFix}
            disabled={isFixingRhyme}
            title="Fix end rhymes"
          />
          <ActionButton
            icon={isGeneratingArt ? <Loader2 className="animate-spin" /> : <ImageIcon2 />}
            label="Art"
            onClick={() => handleGenerateArt(lyricsLines)}
            disabled={isGeneratingArt || !!coverArtUrl}
          />
          <ActionButton
            icon={<Printer />}
            label="PDF"
            onClick={() => generatePDF('lyrics-content', metadata.title || 'song')}
            title="Export PDF (Includes Navarasa Analysis)"
          />
          <ActionButton
            icon={saveStatus === 'saved' ? <CheckCircle2 className="text-green-500" /> : <Bookmark />}
            label="Save"
            onClick={handleSaveLibrary}
          />

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

          <button
            onClick={toggleCinemaMode}
            className="shrink-0 p-3 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 min-w-[44px] min-h-[44px]"
            title="Cinema Mode"
          >
            {isCinemaMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`bg-white dark:bg-slate-900 flex-1 overflow-y-auto ${isCinemaMode ? 'p-8 max-w-5xl mx-auto w-full' : 'min-h-[300px]'}`} id="lyrics-content">
        {viewMode === 'PRETTY' && (
          <LyricsViewer
            sections={sections}
            metadata={metadata}
            coverArtUrl={coverArtUrl}
            setCoverArtUrl={setCoverArtUrl}
            renderStyledLine={renderStyledLine}
            sunoStylePrompt={localStylePrompt} // Passed prop
          />
        )}
        {viewMode === 'EDIT' && <LyricsEditor editableContent={editableContent} setEditableContent={setEditableContent} copyToClipboard={(txt) => navigator.clipboard.writeText(txt)} copyStatus="idle" />}
        {viewMode === 'SUNO' && <SunoExportPanel sunoContent={sunoContent} localStylePrompt={localStylePrompt} setLocalStylePrompt={setLocalStylePrompt} isEnhancingStyle={isEnhancingStyle} handleEnhanceStyle={async () => setLocalStylePrompt(await handleEnhanceStyle(localStylePrompt))} copyToClipboard={(txt) => navigator.clipboard.writeText(txt)} copyStatus="idle" styleCopyStatus="idle" />}
      </div>
    </div>
  );
};
