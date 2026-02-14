
import React, { useMemo, useState } from "react";
import {
  Sparkles, Music, Heart, Palette, Feather, Globe,
  Layers, Hash, Mic2, BookOpen, ChevronDown, ChevronUp,
  Headphones, Filter
} from "lucide-react";
import { useStudio } from "../contexts/StudioContext";
import { AUTO_OPTION } from "../constants";
import { SCENARIO_KNOWLEDGE_BASE } from "../knowledgeBase";

interface ChipData {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string; // tailwind color token e.g. "cyan", "amber", "rose"
}

/**
 * Compact read-only chip strip showing all active generation settings.
 * Renders above the chat input so users can see their selections at a glance.
 */
export const SelectionSummary: React.FC = () => {
  const { generationSettings, languageSettings } = useStudio();
  const [expanded, setExpanded] = useState(false);

  const chips = useMemo<ChipData[]>(() => {
    const list: ChipData[] = [];
    const gs = generationSettings;
    const isSet = (v: string) => v && v !== AUTO_OPTION && v !== "";

    // Ceremony / Category
    if (gs.ceremony) {
      let ceremonyLabel = gs.ceremony;
      let categoryLabel = gs.category;
      for (const cat of SCENARIO_KNOWLEDGE_BASE) {
        const evt = cat.events.find(e => e.id === gs.ceremony);
        if (evt) {
          ceremonyLabel = evt.label;
          categoryLabel = cat.label;
          break;
        }
      }
      list.push({
        key: "ceremony",
        label: "Scenario",
        value: ceremonyLabel,
        icon: <Sparkles className="w-3 h-3" />,
        color: "amber"
      });
    }

    // Theme (skip if same as ceremony label which is auto-set)
    if (isSet(gs.theme) && gs.theme !== gs.ceremony) {
      const themeVal = gs.customTheme && gs.theme === "Custom" ? gs.customTheme : gs.theme;
      // Don't show theme chip if it exactly matches the ceremony label already shown
      const ceremonyEvt = gs.ceremony
        ? SCENARIO_KNOWLEDGE_BASE.flatMap(c => c.events).find(e => e.id === gs.ceremony)
        : null;
      if (!ceremonyEvt || themeVal !== ceremonyEvt.label) {
        list.push({
          key: "theme",
          label: "Theme",
          value: themeVal,
          icon: <BookOpen className="w-3 h-3" />,
          color: "violet"
        });
      }
    }

    // Mood
    if (isSet(gs.mood)) {
      list.push({
        key: "mood",
        label: "Mood",
        value: gs.mood === "Custom" && gs.customMood ? gs.customMood : gs.mood,
        icon: <Heart className="w-3 h-3" />,
        color: "rose"
      });
    }

    // Style
    if (isSet(gs.style)) {
      list.push({
        key: "style",
        label: "Style",
        value: gs.style === "Custom" && gs.customStyle ? gs.customStyle : gs.style,
        icon: <Palette className="w-3 h-3" />,
        color: "cyan"
      });
    }

    // Structure
    if (isSet(gs.structure)) {
      // Shorten long structure names
      const raw = gs.structure === "Custom" && gs.customStructure ? gs.customStructure : gs.structure;
      const shortStructure = raw.length > 30 ? raw.split("(")[0].trim() : raw;
      list.push({
        key: "structure",
        label: "Structure",
        value: shortStructure,
        icon: <Layers className="w-3 h-3" />,
        color: "blue"
      });
    }

    // Rhyme Scheme
    if (isSet(gs.rhymeScheme)) {
      list.push({
        key: "rhyme",
        label: "Rhyme",
        value: gs.rhymeScheme === "Custom" && gs.customRhymeScheme ? gs.customRhymeScheme : gs.rhymeScheme,
        icon: <Hash className="w-3 h-3" />,
        color: "emerald"
      });
    }

    // Complexity
    if (isSet(gs.complexity)) {
      list.push({
        key: "complexity",
        label: "Complexity",
        value: gs.complexity,
        icon: <Filter className="w-3 h-3" />,
        color: "orange"
      });
    }

    // Singer Style
    if (isSet(gs.singerStyle)) {
      list.push({
        key: "singer",
        label: "Singer",
        value: gs.singerStyle === "Custom" && gs.customSingerStyle ? gs.customSingerStyle : gs.singerStyle,
        icon: <Mic2 className="w-3 h-3" />,
        color: "pink"
      });
    }

    // Dialect
    if (isSet(gs.dialect)) {
      list.push({
        key: "dialect",
        label: "Dialect",
        value: gs.dialect === "Custom" && gs.customDialect ? gs.customDialect : gs.dialect,
        icon: <Feather className="w-3 h-3" />,
        color: "teal"
      });
    }

    // Language Mix
    const langs = [languageSettings.primary, languageSettings.secondary, languageSettings.tertiary]
      .filter(Boolean)
      .join(" · ");
    if (langs) {
      list.push({
        key: "language",
        label: "Language",
        value: langs,
        icon: <Globe className="w-3 h-3" />,
        color: "indigo"
      });
    }

    return list;
  }, [generationSettings, languageSettings]);

  if (chips.length === 0) return null;

  // Color map for bg / text classes
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    amber:   { bg: "bg-amber-500/10",   text: "text-amber-600 dark:text-amber-400",   border: "border-amber-500/20" },
    violet:  { bg: "bg-violet-500/10",  text: "text-violet-600 dark:text-violet-400",  border: "border-violet-500/20" },
    rose:    { bg: "bg-rose-500/10",    text: "text-rose-600 dark:text-rose-400",      border: "border-rose-500/20" },
    cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-600 dark:text-cyan-400",      border: "border-cyan-500/20" },
    blue:    { bg: "bg-blue-500/10",    text: "text-blue-600 dark:text-blue-400",      border: "border-blue-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
    orange:  { bg: "bg-orange-500/10",  text: "text-orange-600 dark:text-orange-400",  border: "border-orange-500/20" },
    pink:    { bg: "bg-pink-500/10",    text: "text-pink-600 dark:text-pink-400",      border: "border-pink-500/20" },
    teal:    { bg: "bg-teal-500/10",    text: "text-teal-600 dark:text-teal-400",      border: "border-teal-500/20" },
    indigo:  { bg: "bg-indigo-500/10",  text: "text-indigo-600 dark:text-indigo-400",  border: "border-indigo-500/20" },
  };

  // Show first row (max ~5 chips) collapsed, all when expanded
  const COLLAPSED_MAX = 5;
  const hasOverflow = chips.length > COLLAPSED_MAX;
  const visibleChips = expanded ? chips : chips.slice(0, COLLAPSED_MAX);
  const hiddenCount = chips.length - COLLAPSED_MAX;

  return (
    <div className="w-full mb-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Label */}
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mr-1 select-none whitespace-nowrap">
          Active
        </span>

        {visibleChips.map((chip) => {
          const c = colorMap[chip.color] || colorMap.cyan;
          return (
            <span
              key={chip.key}
              title={`${chip.label}: ${chip.value}`}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm transition-colors ${c.bg} ${c.text} ${c.border} max-w-[160px] select-none`}
            >
              {chip.icon}
              <span className="opacity-60 hidden sm:inline">{chip.label}:</span>
              <span className="truncate">{chip.value}</span>
            </span>
          );
        })}

        {/* Overflow toggle */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors select-none"
            aria-label={expanded ? "Show fewer settings" : `Show ${hiddenCount} more settings`}
          >
            {expanded ? (
              <>Less <ChevronUp className="w-2.5 h-2.5" /></>
            ) : (
              <>+{hiddenCount} <ChevronDown className="w-2.5 h-2.5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
