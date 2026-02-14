
export type AgentType = "CHAT" | "RESEARCH" | "FOLK_EXPERT" | "DEVOTIONAL_EXPERT" | "LYRICIST" | "REVIEW" | "ORCHESTRATOR" | "EMOTION" | "COMPLIANCE" | "MULTIMODAL" | "FORMATTER" | "ART" | "TTS" | "REGIONAL_EXPERT" | "AUDIO_ANALYST" | "DICTIONARY" | "KIDS_EXPERT" | "CRITICS";

export type ColorMode = "light" | "dark" | "system";

export interface AudioSection {
  label: string;
  startTime: string;
  endTime: string;
  confidence: number;
  alternateLabel?: string;
  energyLevel: number; // 0-1
  emotionCategory: string;
}

export interface AudioAnalysisResult {
  trackName?: string;
  musicalMetadata: {
    globalKey: string;
    scale: string;
    detectedModulations: string[];
    tempoBPM: number;
    timeSignature: string;
    rhythmicFeel: string; // e.g., "Swing", "Straight", "Syncopated"
  };
  structure: {
    sections: AudioSection[];
    totalBarsEstimate: number;
  };
  profiles: {
    rhythmicDensity: "Sparse" | "Medium" | "Dense" | "Very Dense";
    densityDescription: string;
    dynamicCurve: string; // Description of loudness over time
    instrumentation: string[];
    timbreTags: string[];
  };
  emotionalDimensions: {
    valence: number; // 0 (Sad/Dark) to 1 (Happy/Bright)
    arousal: number; // 0 (Calm) to 1 (Intense)
    description: string;
  };
  syllableBlueprint: string; // Text description for Lyricist
}

export interface Message {
  id: string;
  role: "user" | "model" | "system";
  content: string;
  senderAgent?: AgentType;
  timestamp: Date;
  audioData?: {
    data: string;
    mimeType: string;
    fileName?: string;
  };
  visualData?: {
    data: string;
    mimeType: string;
    type: 'image' | 'video';
    fileName?: string;
  };
  lyricsData?: {
    title?: string;
    structure?: string;
    ragam?: string;
    taalam?: string;
    language?: string;
    dialect?: string;
    navarasa?: string;
    sentiment?: string;
  };
  complianceReport?: ComplianceReport;
  sunoFormattedContent?: string; 
  sunoStylePrompt?: string; 
  audioAnalysis?: AudioAnalysisResult; // New field to store the structured analysis
}

export interface AgentStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface AgentStatus {
  active: boolean;
  currentAgent: AgentType;
  message: string;
  steps: AgentStep[];
}

export interface AppTheme {
  id: string;
  name: string;
  colors: {
    bgMain: string;       
    bgSidebar: string;    
    textMain: string;     
    textSecondary: string;
    accent: string;       
    accentText: string;   
    border: string;       
  };
}

export interface AppearanceSettings {
  fontSize: number; 
  sidebarWidth: number; // pixels, min 280 max 600
  themeId: string;
  colorMode: ColorMode;
  llmModel: string; // Global default
  agentModels: Record<AgentType, string>; // Per-agent model selection
  customThemes: AppTheme[];
  showAdvanced?: boolean; // Advanced Configuration toggle state
  openSections?: Record<string, boolean>; // Persisted sidebar section open/close
}

export interface LanguageProfile {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface GenerationSettings {
  category: string; 
  ceremony: string; 
  theme: string;
  customTheme: string;
  mood: string;
  customMood: string;
  style: string;
  customStyle: string;
  complexity: "Simple" | "Poetic" | "Complex" | string;
  rhymeScheme: string;
  customRhymeScheme: string;
  singerStyle: string;
  customSingerStyle: string;
  structure: string;
  customStructure: string;
  dialect: string;
  customDialect: string;
}

export interface SavedProfile {
  id: string;
  name: string;
  language: LanguageProfile;
  generation: GenerationSettings;
  timestamp: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  songIds: string[];
  coverImage?: string;
}

export interface SavedSong {
  id: string;
  projectId?: string; // Optional linkage to a project
  title: string;
  content: string;
  sunoContent?: string;
  sunoStylePrompt?: string;
  timestamp: number;
  language?: string;
  theme?: string;
  dialect?: string;
}

export interface DictionaryResult {
  word: string;
  language: string;
  synonyms: string[];
  rhymes: string[];
  metaphors: string[];
  transliteration?: string;
}

export interface LyricSection {
  sectionName: string; 
  lines: string[];
  translation?: string[];
}

export interface PronunciationEntry {
  word: string;
  phonetic: string;
  meaning: string;
}

export interface GeneratedLyrics {
  title: string;
  language: string;
  dialect?: string;
  ragam?: string;
  taalam?: string;
  structure?: string; 
  hookLine?: string;
  context?: string;
  navarasa?: string; // New
  sentiment?: string; // New
  sections: LyricSection[];
  pronunciationGuide?: PronunciationEntry[];
}

export interface EmotionAnalysis {
  sentiment: string;
  navarasa: string; 
  intensity: number; 
  suggestedKeywords: string[];
  vibeDescription: string;
}

export interface ComplianceReport {
  originalityScore: number; 
  flaggedPhrases: string[];
  similarSongs: string[];
  verdict: string; 
}

export interface UserStylePreference {
  preferredThemes: string[];
  preferredComplexity: "Simple" | "Poetic" | "Complex";
  vocabularyStyle: "Classical" | "Modern" | "Colloquial";
}

export type ViewState = 'DASHBOARD' | 'CHAT' | 'LIVE';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
