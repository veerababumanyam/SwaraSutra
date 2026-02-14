
import React from "react";
import { Music, Sparkles, Clock, ListMusic, Download, XCircle, Globe, Zap, BookA, Info, Heart, Flame, Smile, CloudRain, Frown, Sun, Skull } from "lucide-react";
import { GlassButton } from "../ui/GlassButton";

interface LyricsViewerProps {
  sections: { type: 'header' | 'content', text: string, id: number }[];
  metadata: Record<string, string>;
  coverArtUrl: string | null;
  setCoverArtUrl: (url: string | null) => void;
  renderStyledLine: (line: string) => React.ReactNode;
  sunoStylePrompt?: string; // New prop
}

const getNavarasaColor = (rasa: string) => {
  const lower = rasa?.toLowerCase() || '';
  if (lower.includes('shringara') || lower.includes('romantic') || lower.includes('love')) return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
  if (lower.includes('hasya') || lower.includes('funny')) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
  if (lower.includes('karuna') || lower.includes('sad')) return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20';
  if (lower.includes('raudra') || lower.includes('angry')) return 'bg-red-500/10 text-red-600 border-red-500/20';
  if (lower.includes('veera') || lower.includes('courage')) return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
  if (lower.includes('bhayanaka') || lower.includes('fear')) return 'bg-black/10 text-black dark:text-white border-black/20';
  if (lower.includes('shanta') || lower.includes('peace')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  return 'bg-primary/10 text-primary border-primary/20';
};

const getNavarasaIcon = (rasa: string) => {
  const lower = rasa?.toLowerCase() || '';
  if (lower.includes('shringara')) return <Heart className="w-3.5 h-3.5" />;
  if (lower.includes('hasya')) return <Smile className="w-3.5 h-3.5" />;
  if (lower.includes('raudra') || lower.includes('veera')) return <Flame className="w-3.5 h-3.5" />;
  if (lower.includes('karuna')) return <CloudRain className="w-3.5 h-3.5" />;
  if (lower.includes('bhayanaka')) return <Skull className="w-3.5 h-3.5" />;
  if (lower.includes('shanta')) return <Sun className="w-3.5 h-3.5" />;
  return <Sparkles className="w-3.5 h-3.5" />;
};

export const LyricsViewer: React.FC<LyricsViewerProps> = ({
  sections,
  metadata,
  coverArtUrl,
  setCoverArtUrl,
  renderStyledLine,
  sunoStylePrompt
}) => {

  // Helper to parse the formatted string lines back into objects for display
  const renderPronunciationGuide = (startIndex: number) => {
    const guideItems = [];
    for (let i = startIndex + 1; i < sections.length; i++) {
      if (sections[i].type === 'header') break;
      if (!sections[i].text.trim()) continue;

      const parts = sections[i].text.split('|').map(s => s.trim());
      if (parts.length === 3) {
        guideItems.push({ word: parts[0], phonetic: parts[1], meaning: parts[2] });
      }
    }

    if (guideItems.length === 0) return null;

    return (
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl p-5">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
          <BookA className="w-4 h-4 text-primary" /> Pronunciation & Glossary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guideItems.map((item, idx) => (
            <div key={idx} className="glass-subtle p-3 rounded-lg flex flex-col gap-1 border border-slate-200 dark:border-white/5">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-lg text-primary">{item.word}</span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">{item.phonetic}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{item.meaning}"</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 font-telugu relative">
      <div className="absolute top-0 right-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
        <Music className="w-64 h-64 text-foreground" />
      </div>

      <div className="mb-8 p-5 rounded-xl glass-subtle relative overflow-hidden group hover:border-primary/20 transition-colors flex flex-col md:flex-row gap-6 items-start">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {coverArtUrl && (
          <div className="relative shrink-0 w-32 h-32 rounded-lg overflow-hidden shadow-lg border border-white/20 group/art">
            <img src={coverArtUrl} alt="Generated Album Art" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/art:opacity-100 transition-opacity gap-2">
              <button onClick={() => {
                const a = document.createElement('a');
                a.href = coverArtUrl;
                a.download = 'album_art.jpg';
                a.click();
              }} className="p-1.5 bg-white/10 backdrop-blur hover:bg-white/20 rounded-full text-white">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={() => setCoverArtUrl(null)} className="p-1.5 bg-white/10 backdrop-blur hover:bg-red-500/50 rounded-full text-white">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 relative z-10 w-full min-w-0">
          {metadata.title && (
            <h3 className="text-2xl font-cinema font-bold text-slate-900 dark:text-white mb-4 tracking-wide leading-tight">
              {metadata.title}
            </h3>
          )}

          <div className="flex flex-wrap gap-2">
            {metadata.navarasa && (
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${getNavarasaColor(metadata.navarasa)}`} title={metadata.sentiment || 'Emotional Vibe'}>
                {getNavarasaIcon(metadata.navarasa)}
                {metadata.navarasa}
              </span>
            )}
            {metadata.language && (
              <span className="flex items-center gap-1.5 glass-interactive px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm" title="Language">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                {metadata.language}
              </span>
            )}
            {metadata.dialect && (
              <span className="flex items-center gap-1.5 glass-interactive px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm" title="Dialect / Yaasa">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                {metadata.dialect}
              </span>
            )}
            {metadata.music && (
              <span className="flex items-center gap-1.5 glass-interactive px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm" title="Suggested Ragam">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                {metadata.music}
              </span>
            )}
            {metadata.taalam && (
              <span className="flex items-center gap-1.5 glass-interactive px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm" title="Suggested Taalam">
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                {metadata.taalam}
              </span>
            )}
            {metadata.structure && (
              <span className="flex items-center gap-1.5 glass-interactive px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm" title="Song Structure">
                <ListMusic className="w-3.5 h-3.5 text-green-500" />
                {metadata.structure}
              </span>
            )}
          </div>

          {/* Hook Line Highlight */}
          {metadata.hookLine && (
            <div className="mt-4 p-5 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary rounded-r-xl">
              <span className="text-xs font-black uppercase tracking-widest text-primary mb-1.5 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> The Viral Hook
              </span>
              <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white italic leading-tight">
                "{metadata.hookLine}"
              </p>
            </div>
          )}

          {/* Style Prompt Display */}
          {sunoStylePrompt && (
            <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500 flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5" /> Musical DNA (Suno Prompt)
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed line-clamp-2 hover:line-clamp-none transition-all cursor-default">
                {sunoStylePrompt}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 px-1">
        {sections.map((section, i) => {
          // Handle Pronunciation Guide specially
          if (section.text.includes('Pronunciation Guide')) {
            // If it's a header, we render the full guide block and skip the content lines
            if (section.type === 'header') {
              return <React.Fragment key={i}>{renderPronunciationGuide(i)}</React.Fragment>;
            }
            // Skip content lines as they are handled by renderPronunciationGuide
            return null;
          }

          if (section.type === 'header') {
            return (
              <div key={i} className="mt-8 mb-4 flex items-center gap-4 select-none group/header">
                <div className="flex items-center gap-3">
                  <h4 className="text-primary font-cinema text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-primary/20 pb-1 group-hover/header:border-primary/50 transition-colors">
                    {section.text.replace(/[\[\]]/g, '')}
                  </h4>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
              </div>
            );
          }
          if (!section.text.trim()) return <div key={i} className="h-3" />;

          // Skip rendering guide content lines as they were already rendered by the header logic
          const isGuideContent = sections.slice(0, i).reverse().find(s => s.type === 'header')?.text.includes('Pronunciation Guide');
          if (isGuideContent) return null;

          return (
            <p key={i} className="text-lg text-slate-900 dark:text-slate-100 leading-relaxed hover:text-black dark:hover:text-white transition-colors cursor-text selection:bg-primary/20 selection:text-primary pl-1 break-words whitespace-pre-wrap">
              {renderStyledLine(section.text)}
            </p>
          );
        })}
      </div>
    </div>
  );
};
