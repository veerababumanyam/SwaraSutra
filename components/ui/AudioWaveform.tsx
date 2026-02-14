
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { GlassIconButton } from './GlassIconButton';

interface AudioWaveformProps {
  audioData: string; // Base64 data
  mimeType: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ audioData, mimeType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !audioData) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(6, 182, 212, 0.4)', // Cyan 500 with opacity
      progressColor: '#06b6d4', // Cyan 500
      cursorColor: '#f59e0b',
      barWidth: 2,
      barGap: 3,
      barRadius: 3,
      height: 60,
      normalize: true,
      minPxPerSec: 50,
      interact: true,
    });

    // Create a Blob from the base64 data
    const byteCharacters = atob(audioData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);

    wavesurfer.load(url);

    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration());
    });

    wavesurfer.on('audioprocess', (time) => {
      setCurrentTime(time);
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy();
      URL.revokeObjectURL(url);
    };
  }, [audioData, mimeType]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900/50 rounded-xl p-3 border border-white/5 shadow-inner">
      <div className="flex items-center gap-4 mb-2">
        <GlassIconButton onClick={togglePlay} size="sm" variant="default" className="bg-primary hover:bg-primary/80 text-white border-none shadow-lg shadow-cyan-500/20">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </GlassIconButton>
        
        <div ref={containerRef} className="flex-1 cursor-pointer" />

        <div className="flex items-center gap-2 min-w-[60px] justify-end">
           <GlassIconButton onClick={toggleMute} size="sm" variant="ghost">
             {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-primary" />}
           </GlassIconButton>
           <span className="text-[10px] font-mono text-slate-400">
             {formatTime(currentTime)} / {formatTime(duration)}
           </span>
        </div>
      </div>
    </div>
  );
};