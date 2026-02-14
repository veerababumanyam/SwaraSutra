
import React, { useRef, useState, useEffect } from "react";
import { Send, Video, X, Music, Mic2, UploadCloud, StopCircle, Activity, Radio, Film } from "lucide-react";
import { APP_NAME } from "../constants";
import { GlassButton } from "./ui/GlassButton";
import { SelectionSummary } from "./SelectionSummary";

interface ComposerInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isAgentActive: boolean;

  // Updated Visual Props
  selectedVisual: { data: string, mimeType: string, type: 'image' | 'video', fileName: string } | null;
  setSelectedVisual: (visual: { data: string, mimeType: string, type: 'image' | 'video', fileName: string } | null) => void;

  onAudioSelect?: (audio: { data: string, mimeType: string, fileName: string } | null) => void;
  onOpenTapper: () => void;
  rhythmContext: string | null;
  onClearRhythm: () => void;
  onOpenLive?: () => void;
}

export const ComposerInput: React.FC<ComposerInputProps & {
  selectedAudio?: { data: string, mimeType: string, fileName: string } | null,
  setSelectedAudio?: (audio: { data: string, mimeType: string, fileName: string } | null) => void
}> = ({
  input, setInput, onSend, isLoading, isAgentActive, selectedVisual, setSelectedVisual, selectedAudio, setSelectedAudio,
  onOpenTapper, rhythmContext, onClearRhythm, onOpenLive
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const [localAudio, setLocalAudio] = useState<{ data: string, mimeType: string, fileName: string } | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);

    const currentAudio = selectedAudio !== undefined ? selectedAudio : localAudio;
    const setAudio = setSelectedAudio || setLocalAudio;

    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [input]);

    useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (isRecording) {
        interval = setInterval(() => setRecordingDuration(prev => prev + 1), 1000);
      } else {
        setRecordingDuration(0);
      }
      return () => clearInterval(interval);
    }, [isRecording]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    const handleVisualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          const isVideo = file.type.startsWith('video/');

          setSelectedVisual({
            data: base64Data,
            mimeType: file.type,
            type: isVideo ? 'video' : 'image',
            fileName: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          setAudio({
            data: base64Data,
            mimeType: file.type,
            fileName: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    };

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            setAudio({
              data: base64Data,
              mimeType: 'audio/webm',
              fileName: `Voice Note ${new Date().toLocaleTimeString()}`
            });
          };
          reader.readAsDataURL(blob);

          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Please enable microphone access to record.");
      }
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <footer className="flex-shrink-0 p-3 md:p-6 z-20 relative">
        <div className="max-w-4xl mx-auto relative space-y-3">

          {/* Selection Summary */}
          <SelectionSummary />

          {/* Media Preview Area */}
          <div className="flex gap-2 flex-wrap items-end px-1">
            {selectedVisual && (
              <div className="p-2 glass-thick rounded-2xl shadow-lg border border-white/20 flex items-start gap-2 animate-in slide-in-from-bottom-2">
                {selectedVisual.type === 'video' ? (
                  <div className="relative h-16 w-28 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
                    <Video className="w-6 h-6 text-white/50" />
                    <span className="absolute bottom-1 right-1 text-[8px] font-bold text-white bg-black/50 px-1 rounded">VIDEO</span>
                  </div>
                ) : (
                  <img src={`data:${selectedVisual.mimeType};base64,${selectedVisual.data}`} className="h-14 w-14 md:h-16 md:w-16 object-cover rounded-xl border border-white/10 shadow-sm" alt="Upload preview" />
                )}
                <button onClick={() => setSelectedVisual(null)} className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-colors text-muted-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {currentAudio && (
              <div className="p-2.5 glass-thick rounded-2xl shadow-lg border border-white/20 flex items-center gap-3 animate-in slide-in-from-bottom-2 h-[72px] pr-2">
                <div className="h-10 w-10 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-full flex items-center justify-center text-cyan-500 ring-1 ring-cyan-500/20">
                  <Music className="w-5 h-5" />
                </div>
                <div className="flex flex-col max-w-[120px]">
                  <span className="text-[11px] font-bold truncate text-foreground">{currentAudio.fileName}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Audio linked</span>
                </div>
                <button onClick={() => setAudio(null)} className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-colors text-muted-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {rhythmContext && (
              <div className="p-2.5 glass-thick rounded-2xl shadow-lg border border-white/20 flex items-center gap-3 animate-in slide-in-from-bottom-2 h-[72px] pr-2 border-l-4 border-l-amber-500">
                <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 ring-1 ring-amber-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex flex-col max-w-[120px]">
                  <span className="text-[11px] font-bold truncate text-foreground">Rhythm Set</span>
                  <span className="text-[10px] text-muted-foreground font-medium truncate">{rhythmContext.match(/Tempo: (\d+) BPM/)?.[0] || "Custom Beat"}</span>
                </div>
                <button onClick={onClearRhythm} className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-colors text-muted-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ── Input Bar ── */}
          <div className={`composer-bar p-2 md:p-2.5 rounded-[24px] md:rounded-[32px] flex items-end gap-1.5 transition-all duration-300 shadow-xl glass-thick border border-white/20 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/40 ${isRecording ? 'ring-2 ring-red-500/40 border-red-500/40 bg-red-500/5' : ''}`}>

            {/* Tool buttons row */}
            <GlassButton
              variant="subtle"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Upload image or video"
              disabled={isRecording}
              className="rounded-full w-10 h-10 flex-shrink-0 mb-0.5 border-0 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Film className="w-5 h-5" />
            </GlassButton>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleVisualUpload} />

            <GlassButton
              variant="subtle"
              size="icon"
              onClick={() => audioInputRef.current?.click()}
              title="Upload audio file"
              disabled={isRecording}
              className="rounded-full w-10 h-10 flex-shrink-0 mb-0.5 border-0 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <UploadCloud className="w-5 h-5" />
            </GlassButton>
            <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={handleAudioUpload} />

            <GlassButton
              variant={rhythmContext ? "brand" : "subtle"}
              size="icon"
              onClick={onOpenTapper}
              title="Tap a beat"
              disabled={isRecording}
              className={`rounded-full w-10 h-10 flex-shrink-0 mb-0.5 border-0 transition-all ${rhythmContext ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25' : 'hover:bg-primary/10 hover:text-primary'}`}
            >
              <Activity className="w-5 h-5" style={{ color: rhythmContext ? 'white' : undefined }} />
            </GlassButton>

            {onOpenLive && (
              <GlassButton
                variant="subtle"
                size="icon"
                onClick={onOpenLive}
                title="Live brainstorm"
                disabled={isRecording}
                className="rounded-full w-10 h-10 flex-shrink-0 mb-0.5 border-0 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <Radio className="w-5 h-5" />
              </GlassButton>
            )}

            <GlassButton
              variant={isRecording ? "danger" : "subtle"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              title={isRecording ? "Stop recording" : "Record voice"}
              className={`rounded-full w-10 h-10 flex-shrink-0 mb-0.5 border-0 transition-all ${!isRecording && 'hover:bg-primary/10 hover:text-primary'}`}
            >
              {isRecording ? <StopCircle className="w-5 h-5 text-white animate-pulse" /> : <Mic2 className="w-5 h-5" />}
            </GlassButton>

            {/* Text area / Recording indicator */}
            {isRecording ? (
              <div className="flex-1 flex items-center gap-3 px-3 py-3 md:py-3.5 h-[44px] md:h-[48px]">
                <div className="flex gap-0.5 h-4 items-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-1 bg-red-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <span className="text-red-500 font-mono font-bold text-sm animate-pulse tracking-wide">
                  REC {formatTime(recordingDuration)}
                </span>
                <span className="text-xs text-muted-foreground ml-auto font-medium">Listening…</span>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                id="studio-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentAudio ? "Analyze this melody and write lyrics…" : "Describe the song, video, or upload…"}
                disabled={isLoading || isAgentActive}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/60 text-sm md:text-base font-medium px-3 py-3 md:py-2.5 resize-none overflow-y-auto min-h-[44px] md:min-h-[48px] max-h-32 scrollbar-thin"
                rows={1}
              />
            )}

            {/* Send */}
            <button
              onClick={() => onSend()}
              disabled={(!input && !selectedVisual && !currentAudio) || isLoading || isAgentActive || isRecording}
              className="rounded-full w-11 h-11 md:w-12 md:h-12 flex-shrink-0 mb-[-2px] mr-[-2px] flex items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none disabled:bg-slate-200 dark:disabled:bg-slate-800"
            >
              <Send className="w-[18px] h-[18px] md:w-5 md:h-5 ml-0.5" />
            </button>
          </div>

          <p className="text-center mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-50 hidden md:block select-none">
            {APP_NAME} AI System · v1.0.0
          </p>
        </div>
      </footer>
    );
  };
