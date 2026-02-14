
import React, { useState, useEffect, useRef } from "react";
import { Copy, CheckCircle2, Wand2, History, RotateCcw, PenTool, Sparkles, X, ChevronRight, Calculator, Palette, Music2, Feather, AlertCircle } from "lucide-react";
import { GlassButton } from "../ui/GlassButton";
import { countMatras } from "../../utils";
import { rewriteLine } from "../../agents/lyricist";
import { useStudio } from "../../contexts/StudioContext";
import { workflowController, WorkflowCanceledError } from "../../workflows/workflowController";

interface LyricsEditorProps {
  editableContent: string;
  setEditableContent: (s: string) => void;
  copyToClipboard: (text: string) => void;
  copyStatus: 'idle' | 'copied';
}

interface LyricLine {
  id: string;
  text: string;
}

interface Version {
  id: string;
  content: string;
  timestamp: number;
  label: string;
}

export const LyricsEditor: React.FC<LyricsEditorProps> = ({
  editableContent,
  setEditableContent,
  copyToClipboard,
  copyStatus
}) => {
  const { appearance } = useStudio();
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [focusedLineIndex, setFocusedLineIndex] = useState<number | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string>("");
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [showRhymes, setShowRhymes] = useState(true);

  // Magic Rewrite State
  const [selection, setSelection] = useState<{ lineIndex: number, text: string, top: number, left: number } | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);

  // Initialize from content
  useEffect(() => {
    const splitLines = editableContent.split('\n').map((text, idx) => ({
      id: `line-${idx}-${Date.now()}`,
      text
    }));
    setLines(splitLines);

    // Create initial version
    const initialVer: Version = {
      id: 'v1',
      content: editableContent,
      timestamp: Date.now(),
      label: 'Initial Draft'
    };
    setVersions([initialVer]);
    setCurrentVersionId('v1');
  }, []); // Only on mount

  // Sync lines back to parent when changed, debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      const joined = lines.map(l => l.text).join('\n');
      if (joined !== editableContent) {
        setEditableContent(joined);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [lines]);

  const handleLineChange = (index: number, newText: string) => {
    const newLines = [...lines];
    newLines[index].text = newText;
    setLines(newLines);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newLines = [...lines];
      newLines.splice(index + 1, 0, { id: `line-${Date.now()}`, text: '' });
      setLines(newLines);
      setTimeout(() => {
        const nextInput = document.getElementById(`line-input-${index + 1}`);
        nextInput?.focus();
      }, 0);
    } else if (e.key === 'Backspace' && lines[index].text === '' && lines.length > 1) {
      e.preventDefault();
      const newLines = [...lines];
      newLines.splice(index, 1);
      setLines(newLines);
      setTimeout(() => {
        const prevInput = document.getElementById(`line-input-${index - 1}`);
        prevInput?.focus();
      }, 0);
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      document.getElementById(`line-input-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowDown' && index < lines.length - 1) {
      e.preventDefault();
      document.getElementById(`line-input-${index + 1}`)?.focus();
    }
  };

  const saveVersion = () => {
    const content = lines.map(l => l.text).join('\n');
    const newVer: Version = {
      id: `v${versions.length + 1}`,
      content,
      timestamp: Date.now(),
      label: `Take ${versions.length + 1}`
    };
    setVersions([newVer, ...versions]);
    setCurrentVersionId(newVer.id);
  };

  const loadVersion = (ver: Version) => {
    const splitLines = ver.content.split('\n').map((text, idx) => ({
      id: `line-${idx}-${Date.now()}`,
      text
    }));
    setLines(splitLines);
    setCurrentVersionId(ver.id);
    setIsVersionsOpen(false);
  };

  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      setSelection(null);
      return;
    }

    // Only allow single line selection for now to keep logic simple
    const anchorNode = selection.anchorNode;

    // Find closest input parent
    const inputElement = (anchorNode?.nodeType === 3 ? anchorNode.parentNode : anchorNode) as HTMLElement;

    if (inputElement?.tagName === 'INPUT' && inputElement.id.startsWith('line-input-')) {
      const index = parseInt(inputElement.id.split('-')[2]);
      const rect = inputElement.getBoundingClientRect();
      // Calculate relative position to the container
      const containerRect = document.getElementById('editor-container')?.getBoundingClientRect() || { top: 0, left: 0 };

      setSelection({
        lineIndex: index,
        text: selection.toString(),
        top: rect.top - containerRect.top - 40, // Position above line
        left: rect.left - containerRect.left + 20
      });
    } else {
      setSelection(null);
    }
  };

  const performRewrite = async (instruction: string) => {
    if (!selection) return;
    setIsRewriting(true);
    try {
      const fullContext = lines.map(l => l.text).join('\n');
      const actionKey = `rewrite-line:${selection.text}:${instruction}`;
      await workflowController.start("editor", actionKey, async (run) => {
        run.throwIfCanceled();
        const rewrittenText = await rewriteLine(selection.text, instruction, fullContext, appearance.agentModels.LYRICIST);

        const newLines = [...lines];
        newLines[selection.lineIndex].text = newLines[selection.lineIndex].text.replace(selection.text, rewrittenText);
        setLines(newLines);
        setSelection(null);
      }, { latestOnly: true, dedupeMs: 1200 });
    } catch (e) {
      if (e instanceof WorkflowCanceledError) return;
      console.error(e);
      alert("Rewrite failed.");
    } finally {
      setIsRewriting(false);
    }
  };

  // Basic Rhyme Visualizer Logic
  const getRhymeColor = (text: string, index: number): string | null => {
    if (!text || text.trim().startsWith('[') || !showRhymes) return null;

    // Get last word, simple heuristic: match last 2-3 chars
    const lastWord = text.trim().split(/\s+/).pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!lastWord || lastWord.length < 2) return null;

    const suffix = lastWord.slice(-2);

    // Hash suffix to color
    let hash = 0;
    for (let i = 0; i < suffix.length; i++) {
      hash = suffix.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#e879f9'];
    const color = colors[Math.abs(hash) % colors.length];

    return color;
  };

  // --- SYLLABLE CONSISTENCY ANALYZER ---
  const getSyllableData = (index: number) => {
    const currentLine = lines[index];
    if (currentLine.text.startsWith('[') || !currentLine.text.trim()) return null;

    const currentCount = countMatras(currentLine.text);

    // Identify Stanza Boundaries
    let start = index;
    while (start > 0 && lines[start - 1].text.trim() !== '' && !lines[start - 1].text.startsWith('[')) {
      start--;
    }
    let end = index;
    while (end < lines.length - 1 && lines[end + 1].text.trim() !== '' && !lines[end + 1].text.startsWith('[')) {
      end++;
    }

    // Calculate Average for this Stanza
    let total = 0;
    let count = 0;
    for (let i = start; i <= end; i++) {
      const t = lines[i].text;
      if (!t.startsWith('[') && t.trim()) {
        total += countMatras(t);
        count++;
      }
    }

    if (count < 2) return { count: currentCount, isDeviant: false, avg: currentCount };

    const avg = total / count;
    // Flag if deviation is > 20% or > 2 syllables (whichever is more lenient to avoid strict flagging on short lines)
    const deviation = Math.abs(currentCount - avg);
    const isDeviant = deviation > 2.5;

    return { count: currentCount, isDeviant, avg: Math.round(avg * 10) / 10 };
  };

  return (
    <div className="h-full flex flex-col relative" id="editor-container">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/20 overflow-x-auto no-scrollbar gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <GlassButton
              variant="subtle"
              size="sm"
              onClick={() => setIsVersionsOpen(!isVersionsOpen)}
              className="gap-2 text-xs uppercase font-black tracking-widest px-3"
            >
              <History className="w-4 h-4" />
              {versions.find(v => v.id === currentVersionId)?.label || 'Current'}
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isVersionsOpen ? 'rotate-90' : ''}`} />
            </GlassButton>

            {isVersionsOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95">
                {versions.map(v => (
                  <button
                    key={v.id}
                    onClick={() => loadVersion(v)}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-white/10 flex justify-between items-center ${currentVersionId === v.id ? 'bg-primary/20 text-primary font-bold' : 'text-slate-400'}`}
                  >
                    <span>{v.label}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">{new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <GlassButton
            variant="subtle"
            size="sm"
            onClick={saveVersion}
            title="Save Snapshot"
            className="w-8 h-8 p-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </GlassButton>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <GlassButton
            variant={showRhymes ? 'brand' : 'subtle'}
            size="sm"
            onClick={() => setShowRhymes(!showRhymes)}
            title="Toggle Rhyme Heatmap"
            className="w-8 h-8 p-0"
          >
            <Palette className="w-3.5 h-3.5" />
          </GlassButton>
        </div>

        <GlassButton
          variant="subtle"
          size="sm"
          onClick={() => copyToClipboard(lines.map(l => l.text).join('\n'))}
          className="gap-2 text-xs font-bold uppercase tracking-wider px-3 shrink-0"
        >
          {copyStatus === 'copied' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copyStatus === 'copied' ? 'Copied' : 'Copy'}
        </GlassButton>
      </div>

      {/* Line-Based Editor Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950/50 p-4 font-mono text-sm relative scrollbar-thin">
        {lines.map((line, index) => {
          const isMeta = line.text.startsWith('[') && line.text.endsWith(']');
          const rhymeColor = getRhymeColor(line.text, index);
          const syllableData = getSyllableData(index);

          return (
            <div key={line.id} className={`flex items-center gap-3 group ${focusedLineIndex === index ? 'bg-white/5' : ''} rounded px-2 -mx-2 transition-colors`}>
              {/* Gutter: Line Number */}
              <span className="w-7 text-xs text-slate-400 dark:text-slate-500 text-right select-none font-mono">
                {index + 1}
              </span>

              {/* Input Area */}
              <input
                id={`line-input-${index}`}
                type="text"
                value={line.text}
                onChange={(e) => handleLineChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setFocusedLineIndex(index)}
                onSelect={handleTextSelect}
                className={`flex-1 bg-transparent border-none outline-none py-1 text-slate-800 dark:text-slate-200 ${isMeta ? 'text-primary font-bold tracking-widest' : ''}`}
                spellCheck={false}
                autoComplete="off"
              />

              {/* Right Gutter: Visuals */}
              <div className="flex items-center gap-2 min-w-[70px] justify-end">
                {rhymeColor && (
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: rhymeColor }}
                    title="Rhyme Group"
                  />
                )}

                {syllableData && (
                  <div
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded cursor-help transition-all ${syllableData.isDeviant
                      ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40'
                      : 'bg-slate-800 text-slate-500'
                      }`}
                    title={syllableData.isDeviant
                      ? `Inconsistent Rhythm! Count: ${syllableData.count} (Stanza Avg: ${syllableData.avg})`
                      : `Syllables: ${syllableData.count}`}
                  >
                    {syllableData.isDeviant && <AlertCircle className="w-3.5 h-3.5" />}
                    <span className="text-xs font-bold select-none">{syllableData.count}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state filler */}
        <div className="h-[20vh]" onClick={() => {
          // Focus last line if clicking empty area
          document.getElementById(`line-input-${lines.length - 1}`)?.focus();
        }} />

        {/* Magic Rewrite Popover */}
        {selection && (
          <div
            className="absolute z-50 bg-slate-900 border border-primary/30 rounded-lg shadow-2xl p-1 flex gap-1 animate-in zoom-in-95 flex-col min-w-[140px]"
            style={{ top: selection.top, left: selection.left }}
          >
            <button onClick={() => setSelection(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white shadow-md z-10"><X className="w-3 h-3" /></button>

            {isRewriting ? (
              <div className="px-3 py-1.5 flex items-center gap-2 text-xs text-primary font-bold justify-center">
                <Wand2 className="w-3.5 h-3.5 animate-spin" /> Rewriting...
              </div>
            ) : (
              <>
                <div className="flex gap-1">
                  <button onClick={() => performRewrite("Enhance this line with metaphors, similes, or alliteration while maintaining meaning. Make it poetic.")} className="flex-1 px-3 py-2 hover:bg-white/10 rounded text-xs text-white font-bold flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/5">
                    <Feather className="w-3.5 h-3.5 text-pink-400" /> Poetic Polish
                  </button>
                </div>

                <div className="w-full h-px bg-white/10 my-0.5" />

                <button onClick={() => performRewrite("Make it punchier and more energetic")} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded text-xs text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Punchier
                </button>
                <button onClick={() => performRewrite("Fix the meter/syllable count to fit the stanza rhythm")} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded text-xs text-slate-300 flex items-center gap-2">
                  <Calculator className="w-3 h-3 text-cyan-500" /> Fix Meter
                </button>
                <button onClick={() => performRewrite("Change words to rhyme better with previous lines")} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded text-xs text-slate-300 flex items-center gap-2">
                  <PenTool className="w-3 h-3 text-purple-500" /> Rhyme Fix
                </button>
                <button onClick={() => performRewrite("Rewrite to be more uplifting and memorable.")} className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded text-xs text-slate-300 flex items-center gap-2">
                  <Music2 className="w-3 h-3 text-green-500" /> Uplift
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
