
import {
  Languages, Sparkles, Music, Heart, Palette, Save, Trash2,
  ChevronRight, ChevronDown, Sliders, Wand2, HelpCircle,
  ArrowUpRight, X, CheckCircle, Feather,
  Compass, Plus, BrainCircuit, Cpu,
  ShieldCheck, Zap, RotateCcw,
  Command, PenTool, SearchCode, ShieldAlert, FileOutput, Waves, Dna, LayoutPanelLeft,
  Filter, Terminal, MessageSquare, Video, Mic2, Globe, Hash,
  Tractor, Church, Search, Headphones, Trash, Loader2, Book, Clapperboard, FolderPlus,
  Baby, Settings, Info, Key, Download, Upload,
  XCircle, Keyboard, GripVertical
} from "lucide-react";
import React, { useState, useEffect, useRef, useMemo, useCallback, isValidElement, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  SavedProfile, AgentStatus, LanguageProfile, GenerationSettings, SavedSong, AgentType, Project
} from "../types";
import { SCENARIO_KNOWLEDGE_BASE, CeremonyDefinition } from "../knowledgeBase";
import {
  MOOD_OPTIONS, STYLE_OPTIONS, STRUCTURE_OPTIONS,
  RHYME_SCHEME_OPTIONS, SINGER_STYLE_OPTIONS, AUTO_OPTION, COMPLEXITY_OPTIONS,
  MODEL_REGISTRY, DIALECT_OPTIONS
} from "../constants";
import { useStudio } from "../contexts/StudioContext";
import { getActiveApiKey, saveApiKey, clearApiKey, testApiKey } from "../utils";
import { runThemeAgent } from "../agents/theme";
import { ErrorBoundary } from "./ErrorBoundary";
import { GlassButton } from "./ui/GlassButton";
import { GlassInput } from "./ui/GlassInput";
import { GlassIconButton } from "./ui/GlassIconButton";
import { DictionaryTool } from "./tools/DictionaryTool";

// --- UI COMPONENTS ---

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  id?: string;
  isOpen?: boolean; // controlled mode
  onToggle?: (open: boolean) => void; // controlled mode callback
}

const SidebarSection = ({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
  id,
  isOpen: controlledOpen,
  onToggle
}: SidebarSectionProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleToggle = () => {
    const next = !isOpen;
    if (onToggle) onToggle(next);
    else setInternalOpen(next);
  };
  return (
    <div className="border-b border-border/40 last:border-0" id={id}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-muted/30 transition-all group outline-none"
      >
        <span className="text-xs font-black uppercase tracking-[0.15em] flex items-center gap-4 text-muted-foreground group-hover:text-primary transition-colors min-w-0">
          {isValidElement(icon) ? cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5 flex-shrink-0 text-muted-foreground/70 group-hover:text-primary transition-colors" }) : icon}
          <span className="truncate">{title}</span>
        </span>
        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
          {badge}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary/10' : 'bg-transparent'}`}>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
          </div>
        </div>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden min-h-0">
          <div className="px-6 pb-6 pt-1 space-y-5">
            <ErrorBoundary scope={`Sidebar: ${title}`} fallback={<div className="p-2 text-sm text-destructive italic">Panel rendering error</div>}>
              {children}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreferenceSelect = ({
  label,
  icon,
  value,
  options,
  onChange,
  customValue,
  onCustomChange,
}: {
  label: string,
  icon: React.ReactNode,
  value: string,
  options: string[],
  onChange: (val: string) => void,
  customValue?: string,
  onCustomChange?: (val: string) => void,
}) => (
  <div className="space-y-2.5 w-full">
    <label className="font-bold text-foreground/80 flex items-center gap-2 truncate text-[11px] uppercase tracking-widest pl-1">
      {isValidElement(icon) ? cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-3.5 h-3.5 text-primary/70" }) : icon}
      {label}
    </label>
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 glass-bordered rounded-[var(--radius-lg)] focus:ring-2 focus:ring-primary/50 block px-3.5 pr-10 outline-none appearance-none cursor-pointer text-sm font-bold shadow-sm text-foreground bg-transparent hover:bg-white/5 transition-colors"
      >
        {options.map(opt => <option key={opt} value={opt} className="bg-popover text-popover-foreground font-medium py-1">{opt}</option>)}
      </select>
      <div className="absolute right-3.5 top-3.5 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </div>
    {value === "Custom" && onCustomChange && (
      <GlassInput
        type="text"
        value={customValue}
        onChange={(e) => onCustomChange(e.target.value)}
        placeholder="Type custom value..."
        className="animate-in fade-in zoom-in-95 h-10 text-sm mt-2"
        autoFocus
      />
    )}
  </div>
);

const AgentModelCard = ({ agent, label, icon, value, capability, onModelChange, liveStatus }: {
  agent: AgentType | 'GLOBAL', label: string, icon: React.ReactNode, value: string, capability: ('text' | 'image' | 'thinking' | 'audio')[],
  onModelChange: (agent: any, model: string) => void,
  liveStatus?: 'idle' | 'active' | 'completed' | 'failed'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customId, setCustomId] = useState("");

  const validModels = MODEL_REGISTRY.filter(m => capability.some(cap => m.capabilities.includes(cap)));
  const currentModel = MODEL_REGISTRY.find(m => m.id === value) || {
    name: value || 'Unknown Intelligence',
    description: 'Custom model ID or unknown core selected.'
  };

  const handleApplyCustom = () => {
    if (customId.trim()) {
      onModelChange(agent, customId.trim());
      setCustomMode(false);
      setIsExpanded(false);
    }
  };

  return (
    <div className={`rounded-[var(--radius-xl)] border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-card/50 shadow-lg border-primary/20 ring-1 ring-primary/10 backdrop-blur-3xl' : 'glass-interactive border-white/10'}`}>
      <button
        type="button"
        className="w-full p-3 flex items-center justify-between cursor-pointer text-left group"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-[var(--radius-lg)] transition-colors relative ${isExpanded ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-background/40 border border-border text-foreground group-hover:text-primary'}`}>
            {isValidElement(icon) ? cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" }) : icon}
            {liveStatus && liveStatus !== 'idle' && (
              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-card ${liveStatus === 'active' ? 'bg-success animate-pulse shadow-[0_0_6px_hsl(var(--success)/0.6)]' :
                liveStatus === 'completed' ? 'bg-primary' :
                  liveStatus === 'failed' ? 'bg-destructive' : 'bg-muted-foreground'
                }`} />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground truncate">{label}</span>
            <span className="text-sm font-black text-foreground truncate mt-0.5">{currentModel.name}</span>
          </div>
        </div>
        <ChevronRight className={`w-3 h-3 text-foreground transition-transform ${isExpanded ? 'rotate-90 text-primary' : ''}`} />
      </button>
      {isExpanded && (
        <div className="p-3 pt-0 animate-in slide-in-from-top-2">
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed italic border-t border-border pt-2 font-medium">{currentModel.description}</p>
          <div className="space-y-1.5">
            {validModels.map(model => (
              <button key={model.id} onClick={() => { onModelChange(agent, model.id); setIsExpanded(false); setCustomMode(false); }}
                className={`w-full p-2 rounded-[var(--radius-lg)] text-left transition-all border ${value === model.id ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-transparent hover:bg-muted/50 border-transparent text-foreground'}`}>
                <div className="flex justify-between items-center"><span className="text-sm font-bold">{model.name}</span>{model.tier === 'quality' && <Sparkles className="w-3 h-3 text-warning" />}</div>
                <div className="text-xs mt-0.5 opacity-60 flex items-center gap-1.5 capitalize"><div className={`w-1 h-1 rounded-full ${model.tier === 'performance' ? 'bg-primary' : 'bg-warning'}`} />{model.tier} Tier</div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCustomMode(!customMode)}
              className={`w-full p-2 rounded-[var(--radius-lg)] text-left transition-all border flex items-center justify-between ${customMode ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-transparent hover:bg-muted/50 border-transparent text-foreground'}`}
            >
              <span className="text-sm font-bold flex items-center gap-2"><Hash className="w-3 h-3" /> Custom ID</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${customMode ? 'rotate-90' : ''}`} />
            </button>

            {customMode && (
              <div className="p-2 bg-muted/30 rounded-[var(--radius-lg)] border border-border animate-in slide-in-from-top-1">
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  placeholder="e.g., gemini-3-pro-preview"
                  className="w-full bg-background border border-border rounded p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary mb-2 text-foreground"
                />
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="w-full py-2 bg-primary text-primary-foreground rounded font-bold text-xs uppercase tracking-wider hover:brightness-110"
                >
                  Inject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  onClose: () => void;
  agentStatus: AgentStatus;
  onLoadProfile: (language: LanguageProfile, generation: GenerationSettings) => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onLoadSong: (song: SavedSong) => void;
}

export const LayaVaniSidebar: React.FC<SidebarProps> = ({ onClose, agentStatus, onLoadProfile, onOpenHelp, onLoadSong }) => {
  const navigate = useNavigate();
  const {
    languageSettings, setLanguageSettings, updateLanguageSetting,
    generationSettings, setGenerationSettings, updateGenerationSetting,
    savedSongs, deleteSavedSong, assignSongToProject, projects, addProject, deleteProject,
    appearance, setAppearance, isSidebarOpen, updateAgentModel, resetAllAgentModels,
    setTutorialActive, setTutorialStep, clearAllData
  } = useStudio();

  const [profileName, setProfileName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [scenarioSearch, setScenarioSearch] = useState("");
  const [autoConfigured, setAutoConfigured] = useState(false);

  // API Key state
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiTestStatus, setApiTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [apiTestMessage, setApiTestMessage] = useState("");
  const [savedApiKeyMasked, setSavedApiKeyMasked] = useState("");

  // Appearance state (Sidebar specific controls)
  const [themePrompt, setThemePrompt] = useState("");
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Advanced Settings Toggle - persisted via appearance
  const showAdvanced = appearance.showAdvanced ?? false;
  const setShowAdvanced = useCallback((val: boolean) => {
    setAppearance(prev => ({ ...prev, showAdvanced: val }));
  }, [setAppearance]);

  // Section open/close state - persisted via appearance.openSections
  const openSections = appearance.openSections ?? {};
  const getSectionOpen = useCallback((key: string, defaultOpen: boolean) => {
    return openSections[key] !== undefined ? openSections[key] : defaultOpen;
  }, [openSections]);
  const setSectionOpen = useCallback((key: string, open: boolean) => {
    setAppearance(prev => ({
      ...prev,
      openSections: { ...prev.openSections, [key]: open }
    }));
  }, [setAppearance]);

  // Keyboard shortcuts overlay
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Sidebar resize
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebarWidth = appearance.sidebarWidth || 340;
  const MIN_SIDEBAR_WIDTH = 300;
  const MAX_SIDEBAR_WIDTH = 600;

  // Load API key on mount
  useEffect(() => {
    const existingKey = getActiveApiKey();
    console.log("LayaVani Sidebar: Key check on mount:", existingKey ? "Present" : "Missing");
    if (existingKey) {
      setHasApiKey(true);
      setSavedApiKeyMasked(existingKey.slice(0, 6) + "••••••••" + existingKey.slice(-4));
    }
  }, []);

  const handleSaveProfile = () => {
    if (!profileName.trim()) return;
    const newProfile: SavedProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: profileName, language: languageSettings, generation: generationSettings, timestamp: Date.now()
    };
    const updated = [newProfile, ...savedProfiles];
    setSavedProfiles(updated);
    localStorage.setItem("LayaVani_profiles", JSON.stringify(updated));
    setProfileName("");
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: newProjectName,
      description: "New Film Project",
      timestamp: Date.now(),
      songIds: []
    };
    addProject(newProject);
    setNewProjectName("");
  };

  const handleApplyProfile = (profile: SavedProfile) => {
    setLanguageSettings(profile.language);
    setGenerationSettings(profile.generation);
    onLoadProfile(profile.language, profile.generation);
    setAutoConfigured(true);
    setTimeout(() => setAutoConfigured(false), 1500);
  };

  const handleCeremonySelect = (category: string, event: CeremonyDefinition) => {
    setGenerationSettings({
      ...generationSettings, category: category, ceremony: event.id, theme: event.label,
      mood: event.defaultMood, style: event.defaultStyle, complexity: event.defaultComplexity,
      rhymeScheme: event.defaultRhyme, singerStyle: event.defaultSinger, structure: AUTO_OPTION,
      dialect: AUTO_OPTION
    });
    setAutoConfigured(true);
    setTimeout(() => setAutoConfigured(false), 3000);
  };

  // API Key handlers
  const handleSaveApiKey = useCallback(() => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    saveApiKey(trimmed);
    setHasApiKey(true);
    setSavedApiKeyMasked(trimmed.slice(0, 6) + "••••••••" + trimmed.slice(-4));
    setApiKeyInput("");
    setShowApiKey(false);
    setApiTestStatus('idle');
    setApiTestMessage("");
  }, [apiKeyInput]);

  const handleTestApiKey = useCallback(async () => {
    const keyToTest = apiKeyInput.trim() || getActiveApiKey();
    if (!keyToTest) {
      setApiTestStatus('error');
      setApiTestMessage("No API key to test. Enter a key first.");
      return;
    }
    setApiTestStatus('testing');
    setApiTestMessage("Testing connection...");
    const result = await testApiKey(keyToTest);
    setApiTestStatus(result.success ? 'success' : 'error');
    setApiTestMessage(result.message);
  }, [apiKeyInput]);

  const handleRemoveApiKey = useCallback(() => {
    if (confirm("Remove saved API key? You'll need to enter a new one to use AI features.")) {
      clearApiKey();
      setHasApiKey(false);
      setSavedApiKeyMasked("");
      setApiKeyInput("");
      setApiTestStatus('idle');
      setApiTestMessage("");
    }
  }, []);

  // Appearance handlers
  const handleGenerateTheme = useCallback(async () => {
    if (!themePrompt.trim()) return;
    setIsGeneratingTheme(true);
    try {
      const newTheme = await runThemeAgent(themePrompt, appearance.llmModel);
      if (newTheme) {
        setAppearance(prev => ({ ...prev, customThemes: [newTheme, ...prev.customThemes], themeId: newTheme.id }));
        setThemePrompt("");
      }
    } catch (e) { console.error("Theme generation failed", e); }
    finally { setIsGeneratingTheme(false); }
  }, [themePrompt, appearance.llmModel, setAppearance]);



  const handleResetModels = () => {
    if (confirm("Reset all neural core assignments to factory defaults?")) {
      resetAllAgentModels();
    }
  };

  // --- PROFILE EXPORT/IMPORT ---
  const handleExportProfiles = () => {
    const exportData = {
      version: 1,
      profiles: savedProfiles,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LayaVani-profiles-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProfiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const profiles: SavedProfile[] = data.profiles || data; // Support both wrapped and raw array
        if (!Array.isArray(profiles)) throw new Error("Invalid format");
        // Merge: add imported profiles, skip duplicates by id
        const existingIds = new Set(savedProfiles.map(p => p.id));
        const newProfiles = profiles.filter(p => !existingIds.has(p.id));
        const merged = [...newProfiles, ...savedProfiles];
        setSavedProfiles(merged);
        localStorage.setItem("LayaVani_profiles", JSON.stringify(merged));
        setAutoConfigured(true);
        setTimeout(() => setAutoConfigured(false), 2000);
      } catch (err) {
        alert("Invalid profile file. Please use a file exported from LayaVani.");
      }
    };
    input.click();
  };

  // --- CLEAR CEREMONY ---
  const handleClearCeremony = () => {
    setGenerationSettings(prev => ({ ...prev, category: "", ceremony: "", theme: AUTO_OPTION }));
  };

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      if (e.key === 'Escape' && isSidebarOpen) {
        onClose();
        e.preventDefault();
      }
      if (e.key === '?' && e.shiftKey) {
        setShowShortcuts(prev => !prev);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, onClose]);

  // --- SIDEBAR RESIZE ---
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, e.clientX));
      setAppearance(prev => ({ ...prev, sidebarWidth: newWidth }));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setAppearance]);

  // --- AGENT LIVE STATUS MAPPER ---
  const getAgentLiveStatus = useCallback((agentKey: string): 'idle' | 'active' | 'completed' | 'failed' => {
    if (!agentStatus.active && agentStatus.steps.length === 0) return 'idle';
    // Map agent names to their step IDs in the pipeline
    const agentStepMap: Record<string, string[]> = {
      MULTIMODAL: ['1'], AUDIO_ANALYST: ['audio_scan'], EMOTION: ['2'],
      RESEARCH: ['3'], REGIONAL_EXPERT: ['regional'], DEVOTIONAL_EXPERT: ['devotional'],
      FOLK_EXPERT: ['folk'], KIDS_EXPERT: ['kids'], LYRICIST: ['4'],
      COMPLIANCE: ['5'], REVIEW: ['6'], FORMATTER: ['7'],
      ORCHESTRATOR: ['1', '2', '3', '4', '5', '6', '7'],
    };
    const stepIds = agentStepMap[agentKey] || [];
    for (const step of agentStatus.steps) {
      if (stepIds.includes(step.id)) {
        if (step.status === 'active') return 'active';
        if (step.status === 'failed') return 'failed';
        if (step.status === 'completed') return 'completed';
      }
    }
    // Check if this is the current agent
    if (agentStatus.active && agentStatus.currentAgent === agentKey) return 'active';
    return 'idle';
  }, [agentStatus]);

  // --- ACTIVE CEREMONY LABEL ---
  const activeCeremonyLabel = useMemo(() => {
    if (!generationSettings.ceremony) return null;
    for (const cat of SCENARIO_KNOWLEDGE_BASE) {
      const evt = cat.events.find(e => e.id === generationSettings.ceremony);
      if (evt) return { category: cat.label, event: evt.label };
    }
    return null;
  }, [generationSettings.ceremony]);

  const languages = ["Arabic", "Assamese", "Bengali", "Bodo", "Danish", "Dogri", "Dutch", "English", "Finnish", "French", "German", "Greek", "Gujarati", "Hindi", "Italian", "Japanese", "Kannada", "Kashmiri", "Konkani", "Korean", "Maithili", "Malayalam", "Mandarin Chinese", "Manipuri", "Marathi", "Nepali", "Odia", "Polish", "Portuguese", "Punjabi", "Russian", "Sanskrit", "Santali", "Sindhi", "Spanish", "Swedish", "Tamil", "Telugu", "Thai", "Turkish", "Urdu", "Vietnamese"];
  const isMixed = languageSettings.primary !== languageSettings.secondary;

  const filteredKnowledgeBase = useMemo(() => {
    return SCENARIO_KNOWLEDGE_BASE.map(cat => ({
      ...cat,
      events: cat.events.filter(e =>
        !scenarioSearch ||
        e.label.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
        e.promptContext.toLowerCase().includes(scenarioSearch.toLowerCase())
      )
    })).filter(cat => cat.events.length > 0);
  }, [scenarioSearch]);

  const orphanedSongs = savedSongs.filter(s => !s.projectId);

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} aria-hidden={!isSidebarOpen} />

      <aside
        ref={sidebarRef}
        id="tutorial-sidebar"
        className={`
          fixed top-0 lg:top-4 left-0 lg:left-4 bottom-0 lg:bottom-4 z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-[var(--ease-fluid)]
          sidebar min-w-0 overflow-hidden lg:rounded-[var(--radius-xl)] border-r lg:border border-white/10 glass-thick
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-[calc(100%+2rem)]'}
        `}
        style={{ width: `min(90vw, ${sidebarWidth}px)` }}
      >

        {/* SIDEBAR HEADER - Compact settings label */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-border glass z-10">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-primary" />
            <span className="font-black text-xs tracking-[0.2em] uppercase text-foreground">Configuration Panel</span>
          </div>
          <GlassIconButton onClick={onClose} aria-label="Close Sidebar" variant="ghost" size="sm" className="text-foreground hover:text-primary"><X className="w-5 h-5" /></GlassIconButton>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin pb-6 pt-2 min-w-0">

          {/* 1. LANGUAGE MIX */}
          <SidebarSection id="tutorial-language-mix" title="Linguistic Fusion" icon={<Languages />} defaultOpen={true} isOpen={getSectionOpen('linguistic-fusion', true)} onToggle={(v) => setSectionOpen('linguistic-fusion', v)} badge={isMixed && <span className="bg-gradient-to-r from-primary to-purple-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-black text-xs shadow-sm tracking-widest uppercase"><Sparkles className="w-2.5 h-2.5" /> Mix</span>}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-black text-muted-foreground flex items-center justify-between text-xs tracking-wider uppercase"><span>PRIMARY NATIVE</span><span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-[var(--radius-sm)] font-black">REQUIRED</span></label>
                <div className="relative group">
                  <select value={languageSettings.primary} onChange={(e) => updateLanguageSetting('primary', e.target.value)} className="w-full h-11 glass-bordered rounded-[var(--radius-lg)] px-3.5 pr-10 appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 outline-none text-sm font-bold shadow-sm text-foreground bg-transparent hover:bg-white/5 transition-colors">
                    {languages.map(lang => <option key={lang} value={lang} className="bg-popover text-popover-foreground font-medium">{lang}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-black text-muted-foreground text-xs tracking-wider uppercase">SECONDARY PREFERENCE</label>
                <div className="relative group">
                  <select value={languageSettings.secondary} onChange={(e) => updateLanguageSetting('secondary', e.target.value)} className="w-full h-11 glass-bordered rounded-[var(--radius-lg)] px-3.5 pr-10 appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 outline-none text-sm font-bold shadow-sm text-foreground bg-transparent hover:bg-white/5 transition-colors">
                    {languages.map(lang => <option key={lang} value={lang} className="bg-popover text-popover-foreground font-medium">{lang}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-black text-muted-foreground text-xs tracking-widest uppercase">TERTIARY (FUSION MIX)</label>
                <div className="relative group">
                  <select value={languageSettings.tertiary} onChange={(e) => updateLanguageSetting('tertiary', e.target.value)} className="w-full h-11 glass-bordered rounded-[var(--radius-lg)] px-3.5 pr-10 appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 outline-none text-sm font-bold shadow-sm text-foreground bg-transparent hover:bg-white/5 transition-colors">
                    {languages.map(lang => <option key={lang} value={lang} className="bg-popover text-popover-foreground font-medium">{lang}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
                </div>
              </div>
            </div>
          </SidebarSection>

          {/* 2. PADHA-KOSAM (DICTIONARY) */}
          <SidebarSection title="Padha-Kosam" icon={<Book />} isOpen={getSectionOpen('padha-kosam', false)} onToggle={(v) => setSectionOpen('padha-kosam', v)}>
            <DictionaryTool />
          </SidebarSection>

          {/* 3. SUTRA ENGINE */}
          <SidebarSection id="tutorial-context-engine" title="Sutra Engine" icon={<Waves />} defaultOpen={true} isOpen={getSectionOpen('sutra-engine', true)} onToggle={(v) => setSectionOpen('sutra-engine', v)} badge={autoConfigured && <span className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-full animate-pulse text-xs font-black tracking-widest uppercase"><Zap className="w-2.5 h-2.5" /> Wired</span>}>
            <div className="space-y-2">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                <GlassInput
                  type="text"
                  placeholder="Search Scenarios..."
                  value={scenarioSearch}
                  onChange={(e) => setScenarioSearch(e.target.value)}
                  className="pl-9 h-10 text-sm"
                />
              </div>

              {filteredKnowledgeBase.length === 0 && (
                <p className="text-center text-sm text-foreground py-4 italic font-bold">No scenarios match your search.</p>
              )}

              {filteredKnowledgeBase.map((category) => (
                <div key={category.id} className="mb-1">
                  <button type="button" onClick={() => setActiveCategory(activeCategory === category.id ? "" : category.id)} className={`w-full flex items-center justify-between p-2.5 text-left rounded-[var(--radius-lg)] transition-all ${activeCategory === category.id ? "bg-primary/20 font-black text-primary ring-2 ring-primary/40" : "hover:bg-muted text-foreground font-bold"}`}>
                    <span className="text-xs uppercase tracking-widest">{category.label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 text-foreground transition-transform duration-300 ${activeCategory === category.id ? "rotate-90" : ""}`} />
                  </button>
                  {(activeCategory === category.id || scenarioSearch) && (
                    <div className="pl-3 pr-1 py-1.5 space-y-1 border-l-2 border-primary/20 ml-2 mt-1 animate-in slide-in-from-left-1 duration-200">
                      {category.events.map((event) => (
                        <button type="button" key={event.id} onClick={() => handleCeremonySelect(category.id, event)} className={`w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center transition-all ${generationSettings.ceremony === event.id ? "bg-primary text-primary-foreground font-black shadow-md shadow-primary/20" : "hover:bg-muted/50 text-muted-foreground font-bold"}`}>
                          {event.label}{generationSettings.ceremony === event.id && <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SidebarSection>

          {/* 4. SONG BLUEPRINT — All generation controls in one section */}
          <SidebarSection title="Song Blueprint" icon={<LayoutPanelLeft />} defaultOpen={true} isOpen={getSectionOpen('song-blueprint', true)} onToggle={(v) => setSectionOpen('song-blueprint', v)} badge={activeCeremonyLabel && <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold truncate max-w-[100px]">{activeCeremonyLabel.event}</span>}>
            <div className="space-y-4">
              {/* Active Ceremony Indicator */}
              {activeCeremonyLabel && (
                <div className="flex items-center justify-between bg-amber-500/10 border-2 border-amber-500/40 rounded-[var(--radius-lg)] px-3 py-2 animate-in fade-in shadow-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground block">{activeCeremonyLabel.category}</span>
                      <span className="text-sm font-black text-amber-700 dark:text-amber-300 truncate block">{activeCeremonyLabel.event}</span>
                    </div>
                  </div>
                  <GlassIconButton onClick={handleClearCeremony} size="sm" variant="ghost" className="h-5 w-5 p-0.5 hover:text-red-500 flex-shrink-0" aria-label="Clear ceremony"><XCircle className="w-3.5 h-3.5 text-muted-foreground" /></GlassIconButton>
                </div>
              )}

              <div className="space-y-2.5 w-full">
                <label className="font-bold text-foreground/80 flex items-center gap-2 truncate text-[11px] uppercase tracking-widest pl-1">
                  <Compass className="w-3.5 h-3.5 text-primary/70" />
                  Song Theme
                </label>
                <GlassInput
                  type="text"
                  value={generationSettings.theme === AUTO_OPTION ? "" : generationSettings.theme}
                  onChange={(e) => updateGenerationSetting('theme', e.target.value || AUTO_OPTION)}
                  placeholder="e.g., Love, Betrayal, Victory... (Auto if empty)"
                  className="h-11 text-sm bg-transparent"
                />
              </div>
              <PreferenceSelect
                label="Structure" icon={<LayoutPanelLeft />} options={STRUCTURE_OPTIONS}
                value={generationSettings.structure} onChange={(v) => updateGenerationSetting('structure', v)}
                customValue={generationSettings.customStructure} onCustomChange={(v) => updateGenerationSetting('customStructure', v)}
              />
              <PreferenceSelect
                label="Bhava (Mood)" icon={<Heart />} options={MOOD_OPTIONS}
                value={generationSettings.mood} onChange={(v) => updateGenerationSetting('mood', v)}
                customValue={generationSettings.customMood} onCustomChange={(v) => updateGenerationSetting('customMood', v)}
              />
              <PreferenceSelect
                label="Sangeeta (Style)" icon={<Music />} options={STYLE_OPTIONS}
                value={generationSettings.style} onChange={(v) => updateGenerationSetting('style', v)}
                customValue={generationSettings.customStyle} onCustomChange={(v) => updateGenerationSetting('customStyle', v)}
              />
              <PreferenceSelect
                label="Dialect / Yaasa" icon={<Globe />} options={DIALECT_OPTIONS}
                value={generationSettings.dialect} onChange={(v) => updateGenerationSetting('dialect', v)}
                customValue={generationSettings.customDialect} onCustomChange={(v) => updateGenerationSetting('customDialect', v)}
              />
              <PreferenceSelect
                label="Complexity" icon={<Sliders />} options={COMPLEXITY_OPTIONS}
                value={generationSettings.complexity} onChange={(v) => updateGenerationSetting('complexity', v)}
              />
              <PreferenceSelect
                label="Prasa (Rhyme)" icon={<Wand2 />} options={RHYME_SCHEME_OPTIONS}
                value={generationSettings.rhymeScheme} onChange={(v) => updateGenerationSetting('rhymeScheme', v)}
                customValue={generationSettings.customRhymeScheme} onCustomChange={(v) => updateGenerationSetting('customRhymeScheme', v)}
              />
              <PreferenceSelect
                label="Singer Style" icon={<Feather />} options={SINGER_STYLE_OPTIONS}
                value={generationSettings.singerStyle} onChange={(v) => updateGenerationSetting('singerStyle', v)}
                customValue={generationSettings.customSingerStyle} onCustomChange={(v) => updateGenerationSetting('customSingerStyle', v)}
              />
            </div>
          </SidebarSection>

          {/* 5. NEURAL DNA (PROFILES) */}
          <SidebarSection title="Neural DNA" icon={<Dna />} isOpen={getSectionOpen('neural-dna', false)} onToggle={(v) => setSectionOpen('neural-dna', v)} badge={savedProfiles.length > 0 ? <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full font-bold">{savedProfiles.length}</span> : null}>
            <div className="space-y-3">
              <div className="flex gap-2">
                <GlassInput placeholder="Profile name..." value={profileName} onChange={(e) => setProfileName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveProfile()} className="h-8 text-xs" />
                <GlassButton onClick={handleSaveProfile} size="sm" variant="primary" className="w-8 px-0" aria-label="Save Profile"><Plus className="w-4 h-4" /></GlassButton>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto px-1">
                {savedProfiles.map(p => (
                  <div key={p.id} className="flex items-center justify-between glass-interactive p-2.5 rounded-[var(--radius-lg)] border-transparent group">
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-black truncate text-foreground">{p.name}</span>
                      <span className="text-xs font-bold text-muted-foreground">{p.language.primary} · {new Date(p.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-1">
                      <GlassIconButton onClick={() => handleApplyProfile(p)} size="sm" variant="ghost" className="h-6 w-6" aria-label="Load Profile"><ArrowUpRight className="w-3.5 h-3.5 text-foreground" /></GlassIconButton>
                      <GlassIconButton onClick={() => {
                        const updated = savedProfiles.filter(prof => prof.id !== p.id);
                        setSavedProfiles(updated);
                        localStorage.setItem("LayaVani_profiles", JSON.stringify(updated));
                      }} size="sm" variant="ghost" className="h-6 w-6 hover:text-destructive" aria-label="Delete Profile"><Trash2 className="w-3.5 h-3.5 text-foreground" /></GlassIconButton>
                    </div>
                  </div>
                ))}
                {savedProfiles.length === 0 && <p className="text-center text-sm text-foreground py-4 italic font-bold">No neural profiles stored.</p>}
              </div>
              {/* Export / Import */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <GlassButton onClick={handleExportProfiles} size="sm" variant="subtle" className="flex-1 gap-1.5 text-xs uppercase tracking-widest h-7" disabled={savedProfiles.length === 0}>
                  <Download className="w-3 h-3" /> Export
                </GlassButton>
                <GlassButton onClick={handleImportProfiles} size="sm" variant="subtle" className="flex-1 gap-1.5 text-xs uppercase tracking-widest h-7">
                  <Upload className="w-3 h-3" /> Import
                </GlassButton>
              </div>
            </div>
          </SidebarSection>

          {/* 6. FILMOGRAPHY (PROJECTS) */}
          <SidebarSection title="Filmography" icon={<Clapperboard />} isOpen={getSectionOpen('filmography', false)} onToggle={(v) => setSectionOpen('filmography', v)} badge={projects.length > 0 ? <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-black shadow-lg">{projects.length}</span> : null}>
            <div className="space-y-3">
              <div className="flex gap-2">
                <GlassInput placeholder="New Movie/Project..." value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="h-8 text-xs" />
                <GlassButton onClick={handleCreateProject} size="sm" variant="primary" className="w-8 px-0" aria-label="Create Project"><FolderPlus className="w-4 h-4" /></GlassButton>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto px-1">
                {projects.map(project => (
                  <div key={project.id} className="glass-interactive p-3 rounded-[var(--radius-lg)] border-transparent group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase text-primary tracking-[0.1em]">{project.title}</span>
                      <GlassIconButton onClick={() => deleteProject(project.id)} size="sm" variant="ghost" className="hover:text-destructive h-6 w-6 p-1"><Trash2 className="w-3.5 h-3.5 text-foreground" /></GlassIconButton>
                    </div>

                    <div className="space-y-1">
                      {savedSongs.filter(s => s.projectId === project.id).map(song => (
                        <button key={song.id} onClick={() => onLoadSong(song)} className="w-full text-left text-sm text-foreground font-black hover:text-primary hover:bg-muted p-1.5 rounded flex justify-between transition-colors">
                          <span>{song.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
                        </button>
                      ))}
                      {savedSongs.filter(s => s.projectId === project.id).length === 0 && <p className="text-xs italic text-muted-foreground font-bold">No songs yet.</p>}
                    </div>
                  </div>
                ))}

                {/* Orphaned Songs */}
                {orphanedSongs.length > 0 && (
                  <div className="bg-muted/30 p-3 rounded-[var(--radius-lg)] border border-dashed border-border">
                    <span className="text-sm font-black uppercase text-muted-foreground mb-2 block tracking-widest">Unassigned Songs</span>
                    <div className="space-y-1.5">
                      {orphanedSongs.map(song => (
                        <div key={song.id} className="flex items-center gap-1 group">
                          <button onClick={() => onLoadSong(song)} className="text-left text-sm text-foreground font-black hover:text-primary truncate flex-1 p-1">
                            {song.title}
                          </button>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {projects.length > 0 && (
                              <select
                                defaultValue=""
                                onChange={(e) => { if (e.target.value) assignSongToProject(song.id, e.target.value); e.target.value = ""; }}
                                className="glass-bordered rounded text-xs text-foreground font-bold px-1 py-0.5 outline-none cursor-pointer max-w-[80px]"
                                title="Assign to project"
                              >
                                <option value="" disabled>Move to...</option>
                                {projects.map(p => <option key={p.id} value={p.id} className="bg-background text-foreground">{p.title}</option>)}
                              </select>
                            )}
                            <GlassIconButton onClick={() => deleteSavedSong(song.id)} size="sm" variant="ghost" className="h-5 w-5 p-0.5 hover:text-destructive"><Trash2 className="w-3 h-3" /></GlassIconButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SidebarSection>

          {/* ADVANCED SETTINGS - Header-controlled visibility */}
          {showAdvanced && (
            <div className="mt-2">
              <div className="flex items-center gap-2.5 px-5 py-3 border-t border-primary/20 bg-primary/5">
                <Settings className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Advanced Configuration</span>
              </div>
            </div>
          )}

          {showAdvanced && (
            <div className="animate-in slide-in-from-top-2 bg-muted/20 pb-4">

              {/* 8. AGENT PIPELINE - DYNAMIC CONTROLS */}
              <SidebarSection title="Agent Pipeline" icon={<Cpu />} defaultOpen={false} isOpen={getSectionOpen('agent-pipeline', false)} onToggle={(v) => setSectionOpen('agent-pipeline', v)}>
                <div className="space-y-6">
                  {/* Global Engine */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-xs font-black text-foreground uppercase tracking-[0.3em] flex items-center gap-2"><Zap className="w-3 h-3 text-amber-500" /> Master Engine</h5>
                      <GlassIconButton onClick={handleResetModels} size="sm" variant="ghost" title="Reset all assignments"><RotateCcw className="w-3 h-3" /></GlassIconButton>
                    </div>
                    <AgentModelCard agent="GLOBAL" label="Studio Default Brain" icon={<BrainCircuit />} capability={['text']} value={appearance.llmModel} onModelChange={(_, model) => setAppearance(prev => ({ ...prev, llmModel: model }))} />
                  </div>

                  {/* ... Agent Categories ... */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <h5 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2"><PenTool className="w-3 h-3" /> Creative Wing</h5>
                    <AgentModelCard agent="LYRICIST" label="Chief Mahakavi" icon={<Feather />} capability={['text', 'thinking']} value={appearance.agentModels.LYRICIST} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('LYRICIST')} />
                    <AgentModelCard agent="ART" label="Visual Director" icon={<Palette />} capability={['image']} value={appearance.agentModels.ART} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('ART')} />
                    <AgentModelCard agent="TTS" label="Vocalist" icon={<Mic2 />} capability={['audio']} value={appearance.agentModels.TTS} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('TTS')} />
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border">
                    <h5 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center gap-2"><SearchCode className="w-3 h-3" /> Analytical Wing</h5>
                    <AgentModelCard agent="DEVOTIONAL_EXPERT" label="Bhakti Vidwan" icon={<Church />} capability={['text']} value={appearance.agentModels.DEVOTIONAL_EXPERT} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('DEVOTIONAL_EXPERT')} />
                    <AgentModelCard agent="AUDIO_ANALYST" label="Sangeeta Analyst" icon={<Headphones />} capability={['text']} value={appearance.agentModels.AUDIO_ANALYST} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('AUDIO_ANALYST')} />
                    <AgentModelCard agent="RESEARCH" label="Ethnographic Core" icon={<Command />} capability={['text']} value={appearance.agentModels.RESEARCH} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('RESEARCH')} />
                    <AgentModelCard agent="FOLK_EXPERT" label="Janapada Advisor" icon={<Tractor />} capability={['text']} value={appearance.agentModels.FOLK_EXPERT} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('FOLK_EXPERT')} />
                    <AgentModelCard agent="KIDS_EXPERT" label="Kids Viral Expert" icon={<Baby />} capability={['text']} value={appearance.agentModels.KIDS_EXPERT} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('KIDS_EXPERT')} />
                    <AgentModelCard agent="EMOTION" label="Bhava Analyst" icon={<Heart />} capability={['text']} value={appearance.agentModels.EMOTION} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('EMOTION')} />
                    <AgentModelCard agent="REVIEW" label="Literary Critic" icon={<ShieldCheck />} capability={['text', 'thinking']} value={appearance.agentModels.REVIEW} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('REVIEW')} />
                    <AgentModelCard agent="MULTIMODAL" label="Visual Scanner" icon={<Video />} capability={['text']} value={appearance.agentModels.MULTIMODAL} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('MULTIMODAL')} />
                    <AgentModelCard agent="DICTIONARY" label="Lexicon (Dictionary)" icon={<Book />} capability={['text']} value={appearance.agentModels.DICTIONARY} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('DICTIONARY')} />
                    <AgentModelCard agent="REGIONAL_EXPERT" label="Regional Guardrails" icon={<Globe />} capability={['text']} value={appearance.agentModels.REGIONAL_EXPERT} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('REGIONAL_EXPERT')} />
                    <AgentModelCard agent="CRITICS" label="Critics Council" icon={<ShieldAlert />} capability={['text', 'thinking']} value={appearance.agentModels.CRITICS} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('CRITICS')} />
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border">
                    <h5 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2"><Terminal className="w-3 h-3" /> System Core</h5>
                    <AgentModelCard agent="CHAT" label="Studio Interface" icon={<MessageSquare />} capability={['text']} value={appearance.agentModels.CHAT} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('CHAT')} />
                    <AgentModelCard agent="ORCHESTRATOR" label="System Master" icon={<Cpu />} capability={['text']} value={appearance.agentModels.ORCHESTRATOR} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('ORCHESTRATOR')} />
                    <AgentModelCard agent="COMPLIANCE" label="Originality Guard" icon={<ShieldAlert />} capability={['text']} value={appearance.agentModels.COMPLIANCE} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('COMPLIANCE')} />
                    <AgentModelCard agent="FORMATTER" label="Audio Bridge" icon={<FileOutput />} capability={['text']} value={appearance.agentModels.FORMATTER} onModelChange={updateAgentModel} liveStatus={getAgentLiveStatus('FORMATTER')} />
                  </div>
                </div>
              </SidebarSection>

              {/* 10. DATA & PRIVACY (GDPR) */}
              <SidebarSection title="Data & Privacy" icon={<ShieldCheck />} isOpen={getSectionOpen('data-privacy', false)} onToggle={(v) => setSectionOpen('data-privacy', v)}>
                <div className="space-y-3">
                  <p className="text-sm text-slate-900 dark:text-white font-bold leading-relaxed">
                    LayaVani operates locally. Your lyrics and preferences are stored in your browser. To comply with data privacy standards, you can wipe all local data here.
                  </p>
                  <GlassButton
                    variant="danger"
                    onClick={() => {
                      if (confirm("CONFIRM ERASE: This will wipe all saved songs, profiles, and settings. This action cannot be undone.")) {
                        clearAllData();
                      }
                    }}
                    className="w-full gap-2 text-sm uppercase tracking-widest h-9"
                  >
                    <Trash className="w-3.5 h-3.5" />
                    Factory Reset & Erase
                  </GlassButton>
                </div>
              </SidebarSection>
            </div>
          )}

          {/* 9. STUDIO SETTINGS (API Key & Theme) - Mobile First Accessibility */}
          <SidebarSection title="Studio Intelligence" icon={<Key />} isOpen={getSectionOpen('studio-intelligence', false)} onToggle={(v) => setSectionOpen('studio-intelligence', v)}>
            <div className="space-y-6">
              {/* API Key Connection */}
              <div className="space-y-3">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
                  <BrainCircuit className="w-3.5 h-3.5" /> Neural Core Access
                </label>

                {hasApiKey ? (
                  <div className="glass-bordered p-4 rounded-[var(--radius-xl)] space-y-3 bg-primary/5 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-success" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">Linked Brain</span>
                          <span className="text-xs font-mono font-bold text-foreground truncate block">{savedApiKeyMasked}</span>
                        </div>
                      </div>
                      <GlassIconButton onClick={handleRemoveApiKey} size="sm" variant="ghost" className="hover:text-destructive h-8 w-8"><Trash2 className="w-4 h-4" /></GlassIconButton>
                    </div>
                    <GlassButton size="sm" variant="subtle" onClick={handleTestApiKey} className="w-full text-[10px] h-8 bg-white/5" disabled={apiTestStatus === 'testing'}>
                      {apiTestStatus === 'testing' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      Verify Neural Link
                    </GlassButton>
                    {apiTestMessage && (
                      <p className={`text-[10px] font-bold text-center animate-in fade-in ${apiTestStatus === 'success' ? 'text-success' : 'text-destructive'}`}>
                        {apiTestMessage}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-muted-foreground font-medium pl-1 leading-relaxed">
                      Connect your Gemini API Key to enable human-grade lyric orchestration.
                    </p>
                    <div className="relative group">
                      <GlassInput
                        type={showApiKey ? "text" : "password"}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="Paste Gemini API Key..."
                        className="pr-10 h-11 text-sm"
                      />
                      <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-3.5 text-muted-foreground hover:text-primary transition-colors">
                        {showApiKey ? <Info className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <GlassButton onClick={handleSaveApiKey} variant="primary" size="sm" className="flex-1 h-9 text-[11px] uppercase tracking-widest" disabled={!apiKeyInput.trim()}>Link Key</GlassButton>
                      <GlassButton onClick={handleTestApiKey} variant="subtle" size="sm" className="flex-1 h-9 text-[11px] uppercase tracking-widest" disabled={!apiKeyInput.trim() || apiTestStatus === 'testing'}>
                        {apiTestStatus === 'testing' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Test'}
                      </GlassButton>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme / Appearance Generation */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
                  <Palette className="w-3.5 h-3.5" /> Studio Aesthetics
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <Wand2 className="absolute left-3 top-3.5 w-4 h-4 text-primary animate-pulse" />
                    <GlassInput
                      placeholder="Describe a theme (e.g. 'Cyberpunk Pink', 'Classic Bollywood Gold')..."
                      value={themePrompt}
                      onChange={(e) => setThemePrompt(e.target.value)}
                      className="pl-10 h-11 text-sm bg-transparent"
                    />
                  </div>
                  <GlassButton
                    onClick={handleGenerateTheme}
                    disabled={isGeneratingTheme || !themePrompt.trim()}
                    className="w-full h-10 text-[11px] uppercase tracking-widest shadow-lg shadow-primary/10"
                  >
                    {isGeneratingTheme ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Manifest Custom Theme
                  </GlassButton>
                </div>
              </div>
            </div>
          </SidebarSection>

        </div>

        {/* FOOTER */}
        <div className="border-t border-border p-3 bg-background/80 backdrop-blur-sm">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-primary" /> v2.1</span>
            <GlassButton variant="ghost" size="sm" onClick={() => setShowShortcuts(true)} className="gap-1.5 text-[10px] font-bold uppercase tracking-wider h-7 px-2">
              <Keyboard className="w-3 h-3" /> Shortcuts
            </GlassButton>
          </div>
        </div>

        {/* RESIZE HANDLE - desktop only */}
        <div
          onMouseDown={handleResizeStart}
          className="hidden lg:flex absolute top-0 right-0 w-2 h-full cursor-col-resize items-center justify-center group z-10 hover:bg-primary/10 active:bg-primary/20 transition-colors"
          title="Drag to resize sidebar"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
        >
          <div className={`w-0.5 h-8 rounded-full transition-colors ${isResizing ? 'bg-primary' : 'bg-border group-hover:bg-primary/60'}`} />
        </div>
      </aside>

      {/* Keyboard Shortcuts Overlay */}
      {showShortcuts && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowShortcuts(false)} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
          <div className="bg-background border-2 border-border rounded-2xl shadow-2xl p-8 w-[420px] max-w-[92vw] animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black uppercase tracking-[0.15em] flex items-center gap-3"><Keyboard className="w-6 h-6 text-primary" /> Keyboard Shortcuts</h3>
              <GlassIconButton onClick={() => setShowShortcuts(false)} size="sm" variant="ghost" aria-label="Close shortcuts panel"><XCircle className="w-5 h-5" /></GlassIconButton>
            </div>
            <div className="space-y-1">
              {[
                { keys: 'Esc', desc: 'Close sidebar' },
                { keys: 'Shift + ?', desc: 'Toggle this shortcuts panel' },
                { keys: 'Ctrl/⌘ + Enter', desc: 'Send message (in chat)' },
                { keys: 'Ctrl/⌘ + K', desc: 'Focus composer input' },
                { keys: 'Ctrl/⌘ + /', desc: 'Toggle sidebar' },
              ].map(({ keys, desc }) => (
                <div key={keys} className="flex items-center justify-between py-3 px-4 rounded-[var(--radius-lg)] hover:bg-muted transition-colors">
                  <span className="text-sm text-foreground font-black">{desc}</span>
                  <kbd className="text-sm font-mono font-bold bg-background border-2 border-input rounded-[var(--radius-md)] px-3 py-1.5 text-foreground whitespace-nowrap ml-4 shadow-sm">{keys}</kbd>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-black mt-6 text-center">Press <kbd className="font-mono font-bold bg-background border border-input rounded-md px-2 py-0.5 text-sm">Esc</kbd> to close</p>
          </div>
        </div>
      )}
    </>
  );
};
