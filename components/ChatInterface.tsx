
import React, { useRef, useEffect } from "react";
import { User, Bot, BookOpen, Feather, CheckCircle, Heart, ShieldCheck, Video, FileCode, Sparkles, Church, Headphones, Music, Film, Image as ImageIcon, Clapperboard, Mic2 } from "lucide-react";
import { Message, AgentType, AgentStatus, SavedSong } from "../types";
import { LyricsRenderer } from "./LyricsRenderer";
import { WorkflowStatus } from "./WorkflowStatus";

interface ChatInterfaceProps {
  messages: Message[];
  agentStatus: AgentStatus;
  onSaveSong: (song: SavedSong) => void;
}

/* ── Agent metadata for icons, labels and accent colours ── */
const agentMeta: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  RESEARCH: { icon: <BookOpen className="w-4 h-4" />, label: "Ethnographic Researcher", color: "text-blue-500 dark:text-blue-400" },
  LYRICIST: { icon: <Feather className="w-4 h-4" />, label: "Lead Lyricist", color: "text-amber-500 dark:text-amber-400" },
  REVIEW: { icon: <CheckCircle className="w-4 h-4" />, label: "High Council Critic", color: "text-emerald-500 dark:text-emerald-400" },
  EMOTION: { icon: <Heart className="w-4 h-4" />, label: "Emotion Engine", color: "text-pink-500 dark:text-pink-400" },
  COMPLIANCE: { icon: <ShieldCheck className="w-4 h-4" />, label: "Compliance Guard", color: "text-red-500 dark:text-red-400" },
  MULTIMODAL: { icon: <Video className="w-4 h-4" />, label: "Multimodal Analyst", color: "text-indigo-500 dark:text-indigo-400" },
  FORMATTER: { icon: <FileCode className="w-4 h-4" />, label: "Format Engineer", color: "text-cyan-500 dark:text-cyan-400" },
  ORCHESTRATOR: { icon: <Sparkles className="w-4 h-4" />, label: "Studio Orchestrator", color: "text-purple-500 dark:text-purple-400" },
  DEVOTIONAL_EXPERT: { icon: <Church className="w-4 h-4" />, label: "Devotional Expert", color: "text-orange-500 dark:text-orange-400" },
  AUDIO_ANALYST: { icon: <Headphones className="w-4 h-4" />, label: "Audio Analyst", color: "text-rose-500 dark:text-rose-400" },
  CHAT: { icon: <Bot className="w-4 h-4" />, label: "Studio Assistant", color: "text-sky-500 dark:text-sky-400" },
};

const getAgent = (agent?: AgentType) => {
  if (!agent) return { icon: <Clapperboard className="w-4 h-4" />, label: "swarasutra", color: "text-slate-500 dark:text-slate-400" };
  return agentMeta[agent] ?? { icon: <Clapperboard className="w-4 h-4" />, label: "swarasutra", color: "text-slate-500 dark:text-slate-400" };
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, agentStatus, onSaveSong }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentStatus]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6 pt-6 px-4 sm:px-6">
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const isSystem = msg.senderAgent === "ORCHESTRATOR";
        const agent = getAgent(msg.senderAgent);

        return (
          <div
            key={msg.id}
            className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out`}
          >
            {/* ── Avatar ── */}
            <div className="flex-shrink-0 pt-1">
              <div
                className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center transition-all ${isUser
                  ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25"
                  : "glass-bordered bg-white/50 dark:bg-slate-900/50"
                  }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <span className={agent.color}>{agent.icon}</span>}
              </div>
            </div>

            {/* ── Message column ── */}
            <div className={`flex flex-col max-w-[85%] md:max-w-[75%] min-w-0 ${isUser ? "items-end" : "items-start"}`}>

              {/* Sender / timestamp */}
              <div className={`flex items-center gap-2 mb-1.5 ${isUser ? "flex-row-reverse" : ""}`}>
                <span className="text-xs font-bold text-foreground opacity-90">
                  {isUser ? "You" : agent.label}
                </span>
                <span className="text-[10px] tabular-nums text-muted-foreground font-medium">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* Bubble */}
              <div
                className={`text-sm leading-relaxed whitespace-pre-wrap break-words px-5 py-3.5 shadow-sm ${isUser
                  ? "chat-bubble-user rounded-[20px] rounded-tr-sm"
                  : isSystem
                    ? "chat-bubble-system"
                    : "chat-bubble-ai rounded-[20px] rounded-tl-sm"
                  }`}
              >
                {/* Visual */}
                {msg.visualData && (
                  <div className="mb-4 rounded-xl overflow-hidden glass-bordered bg-black/5 dark:bg-black/20">
                    {msg.visualData.type === "video" ? (
                      <div className="relative group">
                        <video controls className="w-full max-h-[320px] object-cover" src={`data:${msg.visualData.mimeType};base64,${msg.visualData.data}`} />
                        <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-md border border-white/10">
                          <Film className="w-3 h-3 text-red-400" /> VIDEO
                        </span>
                      </div>
                    ) : (
                      <div className="relative group">
                        <img src={`data:${msg.visualData.mimeType};base64,${msg.visualData.data}`} className="w-full max-h-[320px] object-cover hover:scale-[1.02] transition-transform duration-500" alt="Visual context" />
                        <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-md border border-white/10">
                          <ImageIcon className="w-3 h-3 text-sky-400" /> IMAGE
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Audio */}
                {msg.audioData && (
                  <div className="mb-4 p-3 rounded-xl glass-bordered flex items-center gap-4 bg-amber-500/5 border-amber-500/10">
                    <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0 text-white">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">Audio Reference</p>
                      <audio controls className="w-full h-8 accent-amber-500" src={`data:${msg.audioData.mimeType};base64,${msg.audioData.data}`} />
                    </div>
                  </div>
                )}

                {/* Content */}
                {isSystem || msg.lyricsData ? (
                  <LyricsRenderer
                    content={msg.content}
                    sunoContent={msg.sunoFormattedContent}
                    sunoStylePrompt={msg.sunoStylePrompt}
                    onSave={(d) => onSaveSong({ id: Date.now().toString(), timestamp: Date.now(), ...d })}
                  />
                ) : (
                  <div className="font-sans text-foreground">{msg.content}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Active workflow */}
      {agentStatus.active && (
        <div className="pl-14 md:pl-16 animate-in fade-in zoom-in-95 duration-500">
          <WorkflowStatus status={agentStatus} />
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
};
