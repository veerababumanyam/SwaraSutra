
import React, { useEffect, useRef, useState } from 'react';
import { LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, X, Activity, Volume2, Radio, Loader2, Save } from 'lucide-react';
import { getAIClient, wrapGenAIError } from '../../utils';
import { MODEL_LIVE } from '../../constants';
import { GlassButton } from '../ui/GlassButton';

// PCM Audio Encoding/Decoding Utilities
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return new Blob([int16], { type: 'audio/pcm' });
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface LiveBrainstormProps {
  onClose: (transcript?: string) => void;
  languageContext: string;
}

export const LiveBrainstorm: React.FC<LiveBrainstormProps> = ({ onClose, languageContext }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // State to hold the ongoing conversation transcript to pass back to the chat
  const [transcriptionHistory, setTranscriptionHistory] = useState<string[]>([]);
  const [currentInputTranscription, setCurrentInputTranscription] = useState('');
  const [currentOutputTranscription, setCurrentOutputTranscription] = useState('');

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null); // LiveSession
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const systemInstruction = `You are swarasutra, a professional lyricist assistant. 
  You are brainstorming with a music director. 
  Context: ${languageContext}.
  Keep responses concise, creative, and rhythmic. 
  If the user hums, try to suggest lyrics that fit the meter.
  Use native terminology for music (Pallavi, Charanam, etc.).`;

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      const ai = getAIClient();

      // Setup Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);

      // Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: MODEL_LIVE,
        callbacks: {
          onopen: () => {
            setIsConnected(true);

            // Input Pipeline
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              if (isMuted) return;

              const inputData = e.inputBuffer.getChannelData(0);
              // Simple volume meter
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolumeLevel(Math.sqrt(sum / inputData.length) * 5);

              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = inputData[i] * 32768;
              }
              const base64Data = encode(new Uint8Array(pcmData.buffer));

              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64Data
                  }
                });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const audioBuffer = await decodeAudioData(
                decode(audioData),
                outputCtx,
                24000,
                1
              );

              // Scheduling
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);

              // Visual feedback
              setVolumeLevel(0.8 + Math.random() * 0.2); // Fake visual activity for AI
              setTimeout(() => setVolumeLevel(0), audioBuffer.duration * 1000);
            }

            // Handle Transcription (Accumulate history)
            if (msg.serverContent?.outputTranscription) {
              setCurrentOutputTranscription(prev => prev + msg.serverContent.outputTranscription.text);
            } else if (msg.serverContent?.inputTranscription) {
              setCurrentInputTranscription(prev => prev + msg.serverContent.inputTranscription.text);
            }

            if (msg.serverContent?.turnComplete) {
              // Commit turn to history
              setTranscriptionHistory(prev => {
                const newEntries = [];
                if (currentInputTranscription) newEntries.push(`User: ${currentInputTranscription}`);
                if (currentOutputTranscription) newEntries.push(`swarasutra: ${currentOutputTranscription}`);
                return [...prev, ...newEntries];
              });
              setCurrentInputTranscription('');
              setCurrentOutputTranscription('');
            }

            // Handle Interruption
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          // Enable transcription so we can save the brainstorming session
          inputAudioTranscription: { model: "gemini-3-flash-preview" },
          outputAudioTranscription: { model: "gemini-3-flash-preview" },
          systemInstruction: systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error("Connection Failed:", e);
      alert("Failed to connect to Neural Live Core. Check API Key.");
      onClose();
    }
  };

  const disconnect = async () => {
    if (sessionRef.current) {
      try {
        // Close logic handled by context cleanup
      } catch (e) { }
    }
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    setIsConnected(false);
  };

  const handleFinishAndSave = () => {
    // Compile final transcript
    const fullTranscript = [
      ...transcriptionHistory,
      currentInputTranscription ? `User: ${currentInputTranscription}` : '',
      currentOutputTranscription ? `swarasutra: ${currentOutputTranscription}` : ''
    ].filter(Boolean).join('\n');

    disconnect();
    onClose(fullTranscript);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-500">
      <button onClick={() => onClose()} className="absolute top-4 right-4 safe-top p-2.5 bg-white/10 rounded-full hover:bg-red-500/50 transition-colors text-white min-w-[44px] min-h-[44px] flex items-center justify-center z-10">
        <X className="w-6 h-6" />
      </button>

      <div className="text-center space-y-2 mb-6 sm:mb-12 px-4">
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-cinema tracking-tighter">
          NEURAL LIVE
        </h2>
        <p className="text-slate-400 text-sm uppercase tracking-widest">
          Real-time Low Latency Voice Interface
        </p>
      </div>

      {/* Visualizer Orb */}
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center mb-6 sm:mb-12">
        {/* Core */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 blur-3xl opacity-30 transition-all duration-100`}
          style={{ transform: `scale(${1 + volumeLevel})` }}
        />
        <div className="relative z-10 w-40 h-40 bg-slate-900 rounded-full border border-white/10 flex items-center justify-center shadow-2xl">
          {isConnected ? (
            <div className="space-y-2 text-center">
              <Activity className={`w-12 h-12 text-cyan-400 mx-auto transition-transform ${volumeLevel > 0.1 ? 'scale-110' : 'scale-100'}`} />
              <div className="text-[10px] font-mono text-cyan-300 animate-pulse">LISTENING</div>
            </div>
          ) : (
            <Loader2 className="w-10 h-10 text-slate-500 animate-spin" />
          )}
        </div>

        {/* Ripples */}
        {isConnected && (
          <>
            <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 sm:gap-6 items-center">
        <GlassButton
          variant={isMuted ? "danger" : "subtle"}
          size="lg"
          className="rounded-full w-16 h-16"
          onClick={() => setIsMuted(!isMuted)}
          title="Toggle Mute"
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </GlassButton>

        <GlassButton
          variant="brand"
          size="lg"
          className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 border-green-400/30"
          onClick={handleFinishAndSave}
          title="End Session & Save Transcript"
        >
          <Save className="w-6 h-6 text-white" />
        </GlassButton>

        <GlassButton
          variant="danger"
          size="lg"
          className="rounded-full w-16 h-16"
          onClick={() => onClose()}
          title="Cancel Session"
        >
          <Radio className="w-6 h-6" />
        </GlassButton>
      </div>

      <p className="mt-8 text-xs text-slate-500 dark:text-slate-400 font-mono max-w-md text-center">
        Gemini 2.5 Native Audio.
        Tap <span className="text-green-500 font-bold">Save</span> to import the brainstorm into the chat.
      </p>
    </div>
  );
};
