import React from "react";
import { Music, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";

interface SunoExportPanelProps {
  sunoContent?: string;
  localStylePrompt: string;
  setLocalStylePrompt: (s: string) => void;
  isEnhancingStyle: boolean;
  handleEnhanceStyle: () => void;
  copyToClipboard: (text: string, isStyle?: boolean) => void;
  copyStatus: 'idle' | 'copied';
  styleCopyStatus: 'idle' | 'copied';
}

export const SunoExportPanel: React.FC<SunoExportPanelProps> = ({
  sunoContent,
  localStylePrompt,
  setLocalStylePrompt,
  isEnhancingStyle,
  handleEnhanceStyle,
  copyToClipboard,
  copyStatus,
  styleCopyStatus
}) => {
  return (
    <div className="font-mono text-sm relative animate-slideIn p-0 h-full flex flex-col">
      <div className="bg-slate-950/80 backdrop-blur-xl border-t border-white/10 text-slate-300 min-h-[250px] sm:min-h-[400px] flex flex-col relative">
        {/* Sticky Header to prevent scroll overlap */}
        <div className="sticky top-0 left-0 right-0 w-full h-12 bg-slate-900/95 border-b border-white/10 flex items-center justify-between px-4 z-10 backdrop-blur-md shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2 tracking-widest">
            <Music className="w-3 h-3 text-primary" /> STUDIO EXPORT (SUNO/UDIO)
          </span>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Editable Style Prompt Section */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl focus-within:border-amber-500/50 transition-colors shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                1. Musical Style DNA
                {isEnhancingStyle && <Loader2 className="w-3 h-3 animate-spin" />}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleEnhanceStyle}
                  disabled={isEnhancingStyle}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-amber-500 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  title="Generate creative fusion style with AI"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Enhance
                </button>
                <button
                  onClick={() => copyToClipboard(localStylePrompt, true)}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {styleCopyStatus === 'copied' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {styleCopyStatus === 'copied' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <textarea
              value={localStylePrompt}
              onChange={(e) => setLocalStylePrompt(e.target.value)}
              className="w-full bg-black/20 rounded-lg text-amber-100/90 text-sm leading-relaxed p-3 border border-white/5 focus:ring-1 focus:ring-amber-500/50 outline-none resize-y min-h-[80px]"
              placeholder="Describe the music style (e.g., Cinematic, fast tempo...)"
            />
          </div>

          {/* Lyrics Section */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">2. Formatted Lyrics</span>
              <button
                onClick={() => copyToClipboard(sunoContent || '')}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {copyStatus === 'copied' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copyStatus === 'copied' ? 'Copied' : 'Copy All'}
              </button>
            </div>
            <div className="relative">
              <pre className="whitespace-pre-wrap selection:bg-purple-900/50 text-slate-300 font-mono leading-relaxed text-xs p-3 bg-black/20 rounded-lg border border-white/5 overflow-x-auto">
                {sunoContent || "Generating formatted lyrics..."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};