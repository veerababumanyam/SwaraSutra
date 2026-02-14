
import React, { createContext, useContext, useState, useEffect, PropsWithChildren, useCallback } from "react";
import { LanguageProfile, GenerationSettings, SavedSong, AppearanceSettings, AgentType, ColorMode, Project } from "../types";
import { getSafeLocalStorage, setSafeLocalStorage, hexToHSL } from "../utils";
import { DEFAULT_THEMES, AUTO_OPTION, MODEL_DEFAULT, DEFAULT_AGENT_MODELS, MODEL_REGISTRY, DEFAULT_SONG_STRUCTURE } from "../constants";

interface StudioContextType {
  languageSettings: LanguageProfile;
  setLanguageSettings: React.Dispatch<React.SetStateAction<LanguageProfile>>;
  generationSettings: GenerationSettings;
  setGenerationSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  updateGenerationSetting: (key: keyof GenerationSettings, value: string) => void;
  updateLanguageSetting: (key: keyof LanguageProfile, value: string) => void;
  savedSongs: SavedSong[];
  projects: Project[];
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addSavedSong: (song: SavedSong) => void;
  deleteSavedSong: (id: string) => void;
  assignSongToProject: (songId: string, projectId: string) => void;
  appearance: AppearanceSettings;
  setAppearance: React.Dispatch<React.SetStateAction<AppearanceSettings>>;
  updateAgentModel: (agent: AgentType, model: string) => void;
  resetAllAgentModels: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCinemaMode: boolean;
  setIsCinemaMode: React.Dispatch<React.SetStateAction<boolean>>;
  tutorialActive: boolean;
  setTutorialActive: (active: boolean) => void;
  tutorialStep: number;
  setTutorialStep: (step: number) => void;
  setColorMode: (mode: ColorMode) => void;
  clearAllData: () => void;
  resetSettingsToDefault: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [languageSettings, setLanguageSettings] = useState<LanguageProfile>(() => {
    const defaults = { primary: "Telugu", secondary: "English", tertiary: "Hindi" };
    return getSafeLocalStorage("swarasutra_languages", defaults);
  });

  const [generationSettings, setGenerationSettings] = useState<GenerationSettings>(() => {
    const defaults: GenerationSettings = {
      category: "", ceremony: "", theme: AUTO_OPTION, customTheme: "", mood: AUTO_OPTION,
      customMood: "", style: AUTO_OPTION, customStyle: "", complexity: AUTO_OPTION,
      rhymeScheme: AUTO_OPTION, customRhymeScheme: "", singerStyle: AUTO_OPTION,
      customSingerStyle: "", structure: DEFAULT_SONG_STRUCTURE, customStructure: "",
      dialect: AUTO_OPTION, customDialect: ""
    };
    return getSafeLocalStorage("swarasutra_gen_settings", defaults);
  });

  const [savedSongs, setSavedSongs] = useState<SavedSong[]>(() => {
    const data = getSafeLocalStorage("swarasutra_saved_songs", []);
    return Array.isArray(data) ? data : [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const data = getSafeLocalStorage("swarasutra_projects", []);
    return Array.isArray(data) ? data : [];
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    const defaults: AppearanceSettings = {
      fontSize: 16,
      sidebarWidth: 340,
      themeId: "swarasutra-default",
      colorMode: "system",
      llmModel: MODEL_DEFAULT,
      agentModels: DEFAULT_AGENT_MODELS,
      customThemes: [],
      showAdvanced: false,
      openSections: {}
    };
    const saved = getSafeLocalStorage("swarasutra_appearance", defaults);

    return {
      ...defaults,
      ...(typeof saved === 'object' && saved !== null ? saved : {}),
      customThemes: (saved && Array.isArray(saved.customThemes)) ? saved.customThemes : []
    };
  });

  useEffect(() => { setSafeLocalStorage("swarasutra_languages", languageSettings); }, [languageSettings]);
  useEffect(() => { setSafeLocalStorage("swarasutra_gen_settings", generationSettings); }, [generationSettings]);
  useEffect(() => { setSafeLocalStorage("swarasutra_saved_songs", savedSongs); }, [savedSongs]);
  useEffect(() => { setSafeLocalStorage("swarasutra_projects", projects); }, [projects]);
  useEffect(() => { setSafeLocalStorage("swarasutra_appearance", appearance); }, [appearance]);

  // Handle Light/Dark/System Mode
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyMode = (mode: ColorMode) => {
      let isDark = false;
      if (mode === "dark") isDark = true;
      else if (mode === "light") isDark = false;
      else isDark = mediaQuery.matches;

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyMode(appearance.colorMode);

    const listener = (e: MediaQueryListEvent) => {
      if (appearance.colorMode === "system") {
        if (e.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [appearance.colorMode]);

  // Apply Theme Colors
  useEffect(() => {
    try {
      const root = document.documentElement;

      // Find the selected theme
      const customThemes = Array.isArray(appearance.customThemes) ? appearance.customThemes : [];
      const theme = [...DEFAULT_THEMES, ...customThemes].find(t => t.id === appearance.themeId) || DEFAULT_THEMES[0];

      if (theme && theme.colors) {
        // Convert Hex to HSL for Tailwind variable compatibility
        // Backgrounds
        root.style.setProperty('--background', hexToHSL(theme.colors.bgMain));
        root.style.setProperty('--sidebar-background', hexToHSL(theme.colors.bgSidebar));
        root.style.setProperty('--card', hexToHSL(theme.colors.bgSidebar)); // Cards match sidebar logic often, or can be lighter

        // Texts
        root.style.setProperty('--foreground', hexToHSL(theme.colors.textMain));
        root.style.setProperty('--muted-foreground', hexToHSL(theme.colors.textSecondary));
        root.style.setProperty('--sidebar-foreground', hexToHSL(theme.colors.textMain));
        root.style.setProperty('--card-foreground', hexToHSL(theme.colors.textMain));

        // Accents & Borders
        root.style.setProperty('--primary', hexToHSL(theme.colors.accent));
        root.style.setProperty('--primary-foreground', hexToHSL(theme.colors.accentText));
        root.style.setProperty('--ring', hexToHSL(theme.colors.accent));
        root.style.setProperty('--border', hexToHSL(theme.colors.border));

        // Secondary/Muted derived (simplification)
        root.style.setProperty('--secondary', hexToHSL(theme.colors.bgSidebar));
        root.style.setProperty('--secondary-foreground', hexToHSL(theme.colors.textMain));
        root.style.setProperty('--muted', hexToHSL(theme.colors.bgSidebar));
      } else {
        // Reset to defaults (Tailwind handles defaults via classes if vars are unset, 
        // but we must unset properties to avoid stuck values)
        const props = ['--background', '--sidebar-background', '--card', '--foreground', '--muted-foreground', '--sidebar-foreground', '--card-foreground', '--primary', '--primary-foreground', '--ring', '--border', '--secondary', '--secondary-foreground', '--muted'];
        props.forEach(p => root.style.removeProperty(p));
      }
    } catch (e) {
      console.warn("swarasutra: Theme application error:", e);
    }
  }, [appearance.themeId, appearance.customThemes, appearance.colorMode]);

  useEffect(() => {
    const completed = localStorage.getItem("swarasutra_tutorial_completed");
    if (!completed) {
      setTutorialActive(true);
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateGenerationSetting = useCallback((key: keyof GenerationSettings, value: string) => {
    setGenerationSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateLanguageSetting = useCallback((key: keyof LanguageProfile, value: string) => {
    setLanguageSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects(prev => [project, ...prev]);
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Also optional: Orphan the songs or delete them. Currently orphans them.
    setSavedSongs(prev => prev.map(s => s.projectId === id ? { ...s, projectId: undefined } : s));
  }, []);

  const addSavedSong = useCallback((song: SavedSong) => {
    if (!song) return;
    setSavedSongs(prev => [song, ...prev]);
    // If song has project ID, update project song list
    if (song.projectId) {
      setProjects(prev => prev.map(p =>
        p.id === song.projectId
          ? { ...p, songIds: [...p.songIds, song.id] }
          : p
      ));
    }
  }, []);

  const deleteSavedSong = useCallback((id: string) => {
    setSavedSongs(prev => prev.filter(s => s.id !== id));
  }, []);

  const assignSongToProject = useCallback((songId: string, projectId: string) => {
    setSavedSongs(prev => prev.map(s => s.id === songId ? { ...s, projectId } : s));
    setProjects(prev => prev.map(p =>
      p.id === projectId && !p.songIds.includes(songId)
        ? { ...p, songIds: [...p.songIds, songId] }
        : p
    ));
  }, []);

  const updateAgentModel = useCallback((agent: AgentType, modelId: string) => {
    setAppearance(prev => ({
      ...prev,
      agentModels: { ...prev.agentModels, [agent]: modelId }
    }));
  }, []);

  const resetAllAgentModels = useCallback(() => {
    setAppearance(prev => ({
      ...prev,
      agentModels: DEFAULT_AGENT_MODELS,
      llmModel: MODEL_DEFAULT
    }));
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setAppearance(prev => ({ ...prev, colorMode: mode }));
  }, []);

  const resetSettingsToDefault = useCallback(() => {
    setLanguageSettings({ primary: "Telugu", secondary: "English", tertiary: "Hindi" });
    setGenerationSettings({
      category: "", ceremony: "", theme: AUTO_OPTION, customTheme: "", mood: AUTO_OPTION,
      customMood: "", style: AUTO_OPTION, customStyle: "", complexity: AUTO_OPTION,
      rhymeScheme: AUTO_OPTION, customRhymeScheme: "", singerStyle: AUTO_OPTION,
      customSingerStyle: "", structure: DEFAULT_SONG_STRUCTURE, customStructure: "",
      dialect: AUTO_OPTION, customDialect: ""
    });
    setAppearance({
      fontSize: 16,
      sidebarWidth: 340,
      themeId: "swarasutra-default",
      colorMode: "system",
      llmModel: MODEL_DEFAULT,
      agentModels: DEFAULT_AGENT_MODELS,
      customThemes: [],
      showAdvanced: false,
      openSections: {}
    });
  }, []);

  const clearAllData = useCallback(() => {
    localStorage.removeItem("swarasutra_languages");
    localStorage.removeItem("swarasutra_gen_settings");
    localStorage.removeItem("swarasutra_saved_songs");
    localStorage.removeItem("swarasutra_projects");
    localStorage.removeItem("swarasutra_appearance");
    localStorage.removeItem("swarasutra_profiles");
    localStorage.removeItem("swarasutra_tutorial_completed");
    localStorage.removeItem("swarasutra_api_key");

    // Reset states to defaults
    setLanguageSettings({ primary: "Telugu", secondary: "English", tertiary: "Hindi" });
    setSavedSongs([]);
    setProjects([]);
    setGenerationSettings({
      category: "", ceremony: "", theme: AUTO_OPTION, customTheme: "", mood: AUTO_OPTION,
      customMood: "", style: AUTO_OPTION, customStyle: "", complexity: AUTO_OPTION,
      rhymeScheme: AUTO_OPTION, customRhymeScheme: "", singerStyle: AUTO_OPTION,
      customSingerStyle: "", structure: DEFAULT_SONG_STRUCTURE, customStructure: "",
      dialect: AUTO_OPTION, customDialect: ""
    });
    // Force reload to ensure clean state and clear sensitive context
    window.location.reload();
  }, []);

  return (
    <StudioContext.Provider value={{
      languageSettings, setLanguageSettings,
      generationSettings, setGenerationSettings,
      updateGenerationSetting, updateLanguageSetting,
      savedSongs, addSavedSong, deleteSavedSong, assignSongToProject,
      projects, addProject, deleteProject,
      appearance, setAppearance,
      updateAgentModel, resetAllAgentModels,
      isSidebarOpen, setIsSidebarOpen,
      isCinemaMode, setIsCinemaMode,
      tutorialActive, setTutorialActive,
      tutorialStep, setTutorialStep,
      setColorMode,
      clearAllData,
      resetSettingsToDefault
    }}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
};
