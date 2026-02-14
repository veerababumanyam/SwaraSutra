
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Menu, X, Home, PlusCircle, Mic2, Settings, HelpCircle,
  Sparkles, ChevronDown, Info, Compass, Keyboard, BrainCircuit,
  Cpu, ShieldCheck, Zap, Palette, Sun, Moon, Monitor,
  Type, Wand2, RotateCcw, Loader2,
  Key, Eye, EyeOff, Wifi, WifiOff, AlertCircle, CheckCircle,
  XCircle, Save, Trash2, Binary, KeyRound
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ViewState, AgentStatus, ColorMode } from "../types";
import { useStudio } from "../contexts/StudioContext";
import { GlassButton } from "./ui/GlassButton";
import { GlassIconButton } from "./ui/GlassIconButton";
import { GlassInput } from "./ui/GlassInput";
import { APP_NAME, DEFAULT_THEMES } from "../constants";
import { runThemeAgent } from "../agents/theme";
import { getActiveApiKey, saveApiKey, clearApiKey, testApiKey } from "../utils";

interface HeaderProps {
  viewState: ViewState;
  setViewState: (view: ViewState) => void;
  onNewChat: () => void;
  onOpenLive: () => void;
  onOpenHelp: () => void;
  agentStatus: AgentStatus;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewState,
  setViewState,
  onNewChat,
  onOpenLive,
  onOpenHelp,
  agentStatus,
  hasMessages,
}) => {
  const navigate = useNavigate();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    appearance,
    setAppearance,
    setTutorialActive,
    setTutorialStep,
    resetSettingsToDefault,
  } = useStudio();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [advancedMenuOpen, setAdvancedMenuOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const advancedMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const appearancePanelRef = useRef<HTMLDivElement>(null);

  // API Key state
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const apiKeyRef = useRef<HTMLDivElement>(null);
  const apiKeyPanelRef = useRef<HTMLDivElement>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiTestStatus, setApiTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [apiTestMessage, setApiTestMessage] = useState("");
  const [savedApiKeyMasked, setSavedApiKeyMasked] = useState("");

  // Appearance state
  const [themePrompt, setThemePrompt] = useState("");
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const themeInputRef = useRef<HTMLInputElement>(null);

  const showAdvanced = appearance.showAdvanced ?? false;
  const currentThemeName = [...DEFAULT_THEMES, ...appearance.customThemes].find(t => t.id === appearance.themeId)?.name || "Default";
  const themeOptions = [...DEFAULT_THEMES.map(t => t.name), ...appearance.customThemes.map(t => t.name)];

  // Close dropdown menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (advancedMenuRef.current && !advancedMenuRef.current.contains(e.target as Node)) {
        setAdvancedMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (
        appearanceRef.current && !appearanceRef.current.contains(e.target as Node) &&
        (!appearancePanelRef.current || !appearancePanelRef.current.contains(e.target as Node))
      ) {
        setAppearanceOpen(false);
      }
      if (
        apiKeyRef.current && !apiKeyRef.current.contains(e.target as Node) &&
        (!apiKeyPanelRef.current || !apiKeyPanelRef.current.contains(e.target as Node))
      ) {
        setApiKeyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load API key on mount
  useEffect(() => {
    const existingKey = getActiveApiKey();
    if (existingKey) {
      setHasApiKey(true);
      setSavedApiKeyMasked(existingKey.slice(0, 6) + "••••••••" + existingKey.slice(-4));
    }
  }, []);

  // Close mobile menu on route-like navigation
  const handleNavigate = useCallback(
    (action: () => void) => {
      action();
      setMobileMenuOpen(false);
    },
    []
  );

  const toggleAdvancedConfig = useCallback(() => {
    const next = !showAdvanced;
    setAppearance((prev) => ({ ...prev, showAdvanced: next }));
    // Open sidebar if enabling advanced to give visibility
    if (next && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
    setAdvancedMenuOpen(false);
  }, [showAdvanced, isSidebarOpen, setAppearance, setIsSidebarOpen]);

  // Appearance handlers
  const handleThemeChange = useCallback((val: string) => {
    const allThemes = [...DEFAULT_THEMES, ...appearance.customThemes];
    const selected = allThemes.find(t => t.name === val);
    if (selected) setAppearance(prev => ({ ...prev, themeId: selected.id }));
  }, [appearance.customThemes, setAppearance]);

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

  const handleSetColorMode = useCallback((mode: ColorMode) => {
    setAppearance(prev => ({ ...prev, colorMode: mode }));
  }, [setAppearance]);

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

  // Keyboard shortcut: Ctrl/Cmd + /  → toggle sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setIsSidebarOpen((prev: boolean) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setIsSidebarOpen]);

  // Active nav link helper
  const isActive = (view: ViewState) => viewState === view;

  // Status indicator color
  const statusColor = agentStatus.active
    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"
    : "bg-slate-300 dark:bg-slate-600";

  const statusLabel = agentStatus.active ? "Orchestrating" : "Idle";

  return (
    <header className="header-bar flex-shrink-0 relative z-40 w-full px-4 pt-4 sticky top-0" role="banner">
      <div className="h-16 flex items-center justify-between px-5 gap-4 glass-thick rounded-full parallax-layer-2 shadow-2xl backdrop-blur-3xl saturate-150 border border-white/20 dark:border-white/10">
        {/* ─── LEFT: Sidebar Toggle + Brand ─── */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          {/* Sidebar / Menu Toggle */}
          <GlassIconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </GlassIconButton>

          {/* Logo & Brand */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group focus:outline-none rounded-xl"
            aria-label="Go to landing page"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl italic shadow-lg shadow-primary/25 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              G
            </div>
            <span className="hidden sm:inline font-cinema font-black text-lg md:text-xl tracking-tighter uppercase italic text-foreground whitespace-nowrap">
              {APP_NAME}
            </span>
          </button>

          {/* ─── Divider (desktop only) ─── */}
          <div className="hidden lg:block w-px h-6 bg-border mx-2" />

          {/* ─── PRIMARY NAV (desktop) ─── */}
          <nav
            className="hidden lg:flex items-center gap-1.5"
            role="navigation"
            aria-label="Primary navigation"
          >
            <NavButton
              active={isActive("DASHBOARD")}
              onClick={() => setViewState("DASHBOARD")}
              icon={<Home className="w-4 h-4" />}
              label="Home"
            />
            <NavButton
              active={false}
              onClick={() => onNewChat()}
              icon={<PlusCircle className="w-4 h-4" />}
              label="New Sutra"
              highlight
            />
            <NavButton
              active={isActive("LIVE")}
              onClick={() => onOpenLive()}
              icon={<Mic2 className="w-4 h-4" />}
              label="Live Session"
            />
          </nav>
        </div>

        {/* ─── RIGHT: Status + Actions ─── */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Agent Status Indicator (visible on lg+) */}
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full glass-bordered bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
            role="status"
            aria-live="polite"
            aria-label={`Agent status: ${statusLabel}`}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`} />
            <span className="hidden xl:inline">{statusLabel}</span>
          </div>

          {/* ─── ACTION PILLS (Universal) ─── */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Appearance Pill */}
            <div className="relative" ref={appearanceRef}>
              <button
                type="button"
                onClick={() => setAppearanceOpen(!appearanceOpen)}
                className={`
                  flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-2xl md:rounded-[20px] 
                  glass-thick border border-white/30 dark:border-white/10 shadow-xl
                  transition-all duration-300 hover:scale-105 active:scale-95 group
                  ${appearanceOpen ? 'ring-2 ring-primary/50 bg-primary/10' : 'hover:bg-white/10'}
                `}
                aria-expanded={appearanceOpen}
                aria-haspopup="true"
                aria-label="Appearance settings"
              >
                <Palette className={`w-5 h-5 transition-colors ${appearanceOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'}`} />
              </button>
            </div>

            {/* API Key Pill */}
            <div className="relative" ref={apiKeyRef}>
              <button
                type="button"
                onClick={() => setApiKeyOpen(!apiKeyOpen)}
                className={`
                  flex items-center gap-2.5 px-3 md:px-4 h-10 md:h-11 rounded-full 
                  glass-thick border shadow-xl transition-all duration-300 hover:scale-105 active:scale-95
                  ${apiKeyOpen ? 'ring-2 ring-primary/50' : 'border-white/30 dark:border-white/10'}
                  ${hasApiKey
                    ? 'bg-emerald-500/15 border-emerald-500/30'
                    : 'bg-amber-500/15 border-amber-500/30'
                  }
                `}
                aria-expanded={apiKeyOpen}
                aria-haspopup="true"
                aria-label="API Key settings"
              >
                <Key className={`w-4 h-4 md:w-4.5 md:h-4.5 ${hasApiKey ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'} ${hasApiKey ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Features Toggle (desktop) */}
          <div className="hidden md:block relative" ref={advancedMenuRef}>
            <button
              type="button"
              onClick={() => setAdvancedMenuOpen(!advancedMenuOpen)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider
                transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${showAdvanced
                  ? "glass-interactive border-primary/20 text-primary shadow-sm ring-1 ring-primary/10"
                  : "glass-interactive text-muted-foreground hover:text-foreground border-transparent"
                }
              `}
              aria-expanded={advancedMenuOpen}
              aria-haspopup="true"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Advanced</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${advancedMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Advanced Dropdown */}
            {advancedMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 glass-thick rounded-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-300 z-50 shadow-2xl border border-white/20">
                {/* Profile Section */}
                <div
                  className="flex items-center gap-3 p-3 mb-2 rounded-xl glass-interactive cursor-pointer group"
                  onClick={() => {
                    navigate("/architect");
                    setAdvancedMenuOpen(false);
                  }}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
                    <img
                      src="/assets/veera_profile.jpg"
                      alt="Veera Babu Manyam"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Veera+Babu&background=0D8ABC&color=fff";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Veera Babu Manyam</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> System Architect
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border my-1.5" />

                <DropdownItem
                  icon={<Compass className="w-4 h-4" />}
                  label="Guided Tour"
                  description="Interactive walkthrough"
                  onClick={() => {
                    setTutorialStep(0);
                    setTutorialActive(true);
                    setAdvancedMenuOpen(false);
                  }}
                />
                <DropdownItem
                  icon={<Keyboard className="w-4 h-4" />}
                  label="Keyboard Shortcuts"
                  description="View all shortcuts"
                  onClick={() => {
                    // Open sidebar shortcuts panel via keyboard event
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", {
                        key: "?",
                        shiftKey: true,
                        bubbles: true,
                      })
                    );
                    setAdvancedMenuOpen(false);
                  }}
                />
                <DropdownItem
                  icon={<HelpCircle className="w-4 h-4" />}
                  label="Help & FAQ"
                  description="Documentation & support"
                  onClick={() => {
                    onOpenHelp();
                    setAdvancedMenuOpen(false);
                  }}
                />
                <DropdownItem
                  icon={<Info className="w-4 h-4" />}
                  label="About / Credits"
                  description="Version info & credits"
                  onClick={() => {
                    navigate("/about");
                    setAdvancedMenuOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile: New Sutra Quick Action */}
          <GlassButton
            variant="brand"
            size="sm"
            onClick={() => handleNavigate(onNewChat)}
            className="lg:hidden gap-1.5 text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary/20"
            aria-label="New composition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden min-[480px]:inline">New Sutra</span>
          </GlassButton>

          {/* Mobile: Overflow Menu */}
          <div className="lg:hidden relative" ref={mobileMenuRef}>
            <GlassIconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="More options"
              variant="ghost"
              size="sm"
              className="text-foreground"
            >
              <MoreDotsIcon />
            </GlassIconButton>

            {/* Mobile Dropdown Backdrop (Dimmer) */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 bg-black/5 z-40 lg:hidden animate-in fade-in" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 glass-auto-elevated rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 border border-white/20 bg-white/95 backdrop-blur-3xl">
                <DropdownItem
                  icon={<Home className="w-4 h-4" />}
                  label="Home"
                  onClick={() => handleNavigate(() => setViewState("DASHBOARD"))}
                  active={isActive("DASHBOARD")}
                />
                <DropdownItem
                  icon={<Mic2 className="w-4 h-4" />}
                  label="Live Brainstorm"
                  description="Real-time ideation session"
                  onClick={() => handleNavigate(onOpenLive)}
                  active={isActive("LIVE")}
                />
                <div className="h-px bg-border my-1.5" />
                <DropdownItem
                  icon={<Settings className="w-4 h-4" />}
                  label={showAdvanced ? "Hide Advanced" : "Advanced Features"}
                  description="Agent Pipeline & Privacy"
                  onClick={() => {
                    toggleAdvancedConfig();
                    setMobileMenuOpen(false);
                  }}
                  active={showAdvanced}
                />
                <div className="h-px bg-border my-1.5" />
                <DropdownItem
                  icon={<Compass className="w-4 h-4" />}
                  label="Guided Tour"
                  onClick={() => {
                    setTutorialStep(0);
                    setTutorialActive(true);
                    setMobileMenuOpen(false);
                  }}
                />
                <DropdownItem
                  icon={<HelpCircle className="w-4 h-4" />}
                  label="Help & Guide"
                  onClick={() => {
                    onOpenHelp();
                    setMobileMenuOpen(false);
                  }}
                />
                <DropdownItem
                  icon={<Info className="w-4 h-4" />}
                  label="About"
                  onClick={() => {
                    navigate("/about");
                    setMobileMenuOpen(false);
                  }}
                />
                <DropdownItem
                  icon={<Cpu className="w-4 h-4" />}
                  label="System Architect"
                  onClick={() => {
                    navigate("/architect");
                    setMobileMenuOpen(false);
                  }}
                />

                {/* Status */}
                <div className="flex items-center gap-2 px-3 py-2 mt-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {statusLabel}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Appearance Panel — floating overlay, works on all screen sizes */}
      {
        appearanceOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setAppearanceOpen(false)} />
        )
      }
      {
        appearanceOpen && (
          <div ref={appearancePanelRef} className="absolute right-2 md:right-4 top-full mt-2 w-[calc(100vw-1rem)] max-w-80 glass-auto-elevated rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50 space-y-5 border border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-foreground flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" /> Appearance
              </h3>
              <button
                type="button"
                onClick={() => setAppearanceOpen(false)}
                className="md:hidden text-muted-foreground hover:text-foreground p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Mode */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Visual Mode</label>
              <div className="flex gap-1.5">
                {([
                  { mode: "light" as ColorMode, icon: Sun, label: "Light" },
                  { mode: "dark" as ColorMode, icon: Moon, label: "Dark" },
                  { mode: "system" as ColorMode, icon: Monitor, label: "System" },
                ] as const).map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSetColorMode(mode)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border ${appearance.colorMode === mode
                      ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 border-transparent"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Theme</label>
              <div className="relative">
                <select
                  value={currentThemeName}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="w-full glass-bordered text-foreground text-sm font-medium rounded-lg p-2.5 pr-8 outline-none appearance-none cursor-pointer hover:border-primary/40 focus:ring-2 focus:ring-primary/50 transition-all bg-[oklch(var(--card)/0.5)]"
                >
                  {themeOptions.map(opt => <option key={opt} value={opt} className="bg-popover text-popover-foreground">{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* AI Theme */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">AI Theme Generator</label>
              <div className="flex gap-1.5">
                <GlassInput
                  ref={themeInputRef}
                  type="text"
                  placeholder="e.g., 'Retro Gold'..."
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateTheme()}
                  disabled={isGeneratingTheme}
                  className="h-9 text-sm flex-1"
                />
                <GlassButton
                  onClick={handleGenerateTheme}
                  disabled={isGeneratingTheme || !themePrompt.trim()}
                  size="sm"
                  variant="primary"
                  className="w-9 h-9 px-0"
                  aria-label="Generate Theme"
                >
                  {isGeneratingTheme ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                </GlassButton>
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Text Size
                <span className="ml-auto text-primary font-mono">{appearance.fontSize}px</span>
              </label>
              <input
                type="range"
                min={12}
                max={24}
                step={1}
                value={appearance.fontSize}
                onChange={(e) => setAppearance(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                className="w-full h-1.5 accent-primary cursor-pointer rounded-full"
                aria-label="Font size"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Small</span><span>Default</span><span>Large</span>
              </div>
            </div>

            {/* Reset */}
            <div className="pt-3 border-t border-border">
              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset All Settings
                </button>
              ) : (
                <div className="space-y-2.5 p-3 bg-red-500/5 border border-red-500/20 rounded-xl animate-in fade-in">
                  <p className="text-[11px] text-red-500 font-medium text-center leading-relaxed">
                    Reset all settings to defaults? Songs & projects are kept.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted transition-all"
                    >Cancel</button>
                    <button
                      type="button"
                      onClick={() => { resetSettingsToDefault(); setShowResetConfirm(false); setAppearanceOpen(false); }}
                      className="flex-1 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" /> Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* API Key Panel — floating overlay */}
      {
        apiKeyOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setApiKeyOpen(false)} />
        )
      }
      {
        apiKeyOpen && (
          <div ref={apiKeyPanelRef} className="absolute right-2 md:right-4 top-full mt-2 w-[calc(100vw-1rem)] max-w-80 glass-auto-elevated rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50 space-y-4 border border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" /> Studio Brain
              </h3>
              <button
                type="button"
                onClick={() => setApiKeyOpen(false)}
                className="md:hidden text-muted-foreground hover:text-foreground p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Card */}
            <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${hasApiKey
              ? "bg-emerald-500/5 border-emerald-500/20"
              : "bg-amber-500/5 border-amber-500/20"
              }`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${hasApiKey ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]'} animate-pulse`} />
              <div className="min-w-0 flex-1">
                <span className={`text-xs font-bold block ${hasApiKey ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {hasApiKey ? "Gemini Linked" : "API Key Required"}
                </span>
                {savedApiKeyMasked && (
                  <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">{savedApiKeyMasked}</span>
                )}
              </div>
              {hasApiKey ? <Wifi className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <WifiOff className="w-4 h-4 text-amber-500 flex-shrink-0" />}
            </div>

            {/* Key Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {hasApiKey ? "Update API Key" : "Enter API Key"}
              </label>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIza..."
                    className="w-full glass-bordered px-3 py-2 pr-8 rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showApiKey ? "Hide key" : "Show key"}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim()}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={apiTestStatus === 'testing'}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 text-foreground disabled:opacity-40 transition-all"
              >
                {apiTestStatus === 'testing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />} Test
              </button>
              {hasApiKey && (
                <button
                  type="button"
                  onClick={handleRemoveApiKey}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Test Result */}
            {apiTestStatus !== 'idle' && apiTestStatus !== 'testing' && (
              <div className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${apiTestStatus === 'success'
                ? "bg-emerald-500/5 text-emerald-600 border border-emerald-500/20"
                : "bg-red-500/5 text-red-600 border border-red-500/20"
                }`}>
                {apiTestStatus === 'success' ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                <span className="leading-relaxed">{apiTestMessage}</span>
              </div>
            )}

            {/* Help Link */}
            <div className="pt-1 border-t border-border">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium text-primary hover:bg-primary/5 transition-all"
              >
                <Binary className="w-3.5 h-3.5" />
                Get a free Gemini API key →
              </a>
            </div>

            {/* AI Studio bridge */}
            {typeof window !== 'undefined' && (window as any).aistudio && (
              <button
                type="button"
                onClick={() => {
                  (window as any).aistudio.openSelectKey();
                  setApiKeyOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all"
              >
                <KeyRound className="w-4 h-4" /> Select via AI Studio
              </button>
            )}
          </div>
        )
      }
    </header >
  );
};

/* ─── Sub-components ─── */

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  active,
  onClick,
  icon,
  label,
  highlight,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      relative flex items-center gap-2 px-4 py-2 rounded-[14px] text-sm font-bold uppercase tracking-wider
      transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      ${active
        ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 scale-105"
        : highlight
          ? "text-primary hover:bg-primary/5 hover:scale-105"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
      }
    `}
    aria-current={active ? "page" : undefined}
  >
    {icon}
    {label}
  </button>
);

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  active?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  icon,
  label,
  description,
  onClick,
  active,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group
      ${active
        ? "bg-primary/10 text-primary"
        : "text-foreground hover:bg-muted/50"
      }
    `}
  >
    <span
      className={`mt-0.5 flex-shrink-0 transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
        }`}
    >
      {icon}
    </span>
    <div className="min-w-0 flex-1">
      <span className="text-sm font-bold block text-foreground">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground block mt-0.5 leading-tight">
          {description}
        </span>
      )}
    </div>
    {active && (
      <Zap className="w-3 h-3 text-primary flex-shrink-0 mt-1" />
    )}
  </button>
);

const MoreDotsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);