
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Activity, RotateCcw, Check, Music, Zap, MousePointerClick } from "lucide-react";
import { GlassModal } from "../ui/GlassModal";
import { GlassButton } from "../ui/GlassButton";

interface RhythmTapperProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (rhythmData: string) => void;
}

export const RhythmTapper: React.FC<RhythmTapperProps> = ({ isOpen, onClose, onApply }) => {
  const [taps, setTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number>(0);
  const [laya, setLaya] = useState<string>("-");
  const [stability, setStability] = useState<string>("-");
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Analyze taps to calculate BPM and characteristics
  const analyzeRhythm = useCallback(() => {
    if (taps.length < 2) {
      setBpm(0);
      setLaya("-");
      setStability("-");
      return;
    }

    // Calculate intervals
    const intervals = [];
    for (let i = 1; i < taps.length; i++) {
      intervals.push(taps[i] - taps[i - 1]);
    }

    // Average interval
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    
    // BPM Calculation
    const calculatedBpm = Math.round(60000 / avgInterval);
    setBpm(calculatedBpm);

    // Laya (Tempo) Classification
    let currentLaya = "Madhya Laya (Medium)";
    if (calculatedBpm < 75) currentLaya = "Vilamba Laya (Slow/Melodic)";
    else if (calculatedBpm > 115) currentLaya = "Druta Laya (Fast/Mass)";
    setLaya(currentLaya);

    // Stability (Variance)
    const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    // If deviation is high relative to the interval, it's likely free flow or complex syncopation
    const deviationRatio = stdDev / avgInterval;
    
    let currentStability = "Strict Meter (Steady)";
    if (deviationRatio > 0.15) currentStability = "Syncopated / Free Flow";
    setStability(currentStability);

  }, [taps]);

  useEffect(() => {
    analyzeRhythm();
  }, [taps, analyzeRhythm]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    setTaps(prev => {
      // Reset if pause is too long (3 seconds)
      if (prev.length > 0 && now - prev[prev.length - 1] > 3000) {
        return [now];
      }
      return [...prev, now];
    });
    
    // Visual feedback
    if (buttonRef.current) {
        buttonRef.current.style.transform = "scale(0.95)";
        setTimeout(() => {
            if(buttonRef.current) buttonRef.current.style.transform = "scale(1)";
        }, 50);
    }
  }, []);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.code === "Space") {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleTap]);

  const handleReset = () => {
    setTaps([]);
    setBpm(0);
  };

  const handleConfirm = () => {
    if (bpm > 0) {
      const contextString = `[Rhythmic Blueprint]: Tempo: ${bpm} BPM. Laya: ${laya}. Feel: ${stability}. Derived from user manual tapping.`;
      onApply(contextString);
      onClose();
    }
  };

  return (
    <GlassModal open={isOpen} onOpenChange={(open) => !open && onClose()} title="Rhythm Tapper (Tala)">
      <div className="flex flex-col items-center gap-6 p-2">
        <div className="text-center space-y-1">
           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Define Your Meter (Chandassu)</p>
           <p className="text-[10px] text-slate-500">Tap the SPACEBAR or the button below to the beat of your song.</p>
        </div>

        {/* Tap Area */}
        <button
          ref={buttonRef}
          onClick={handleTap}
          className={`
            w-32 h-32 rounded-full flex flex-col items-center justify-center gap-1
            transition-all duration-75 shadow-2xl
            ${taps.length > 0 
                ? 'bg-gradient-to-br from-primary to-blue-600 border-4 border-white/20 shadow-primary/40' 
                : 'bg-slate-800 border-4 border-slate-700 text-slate-500'
            }
          `}
        >
           {taps.length > 0 ? (
               <>
                 <span className="text-3xl font-black text-white">{bpm}</span>
                 <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">BPM</span>
               </>
           ) : (
               <>
                 <MousePointerClick className="w-8 h-8 opacity-50" />
                 <span className="text-[9px] font-bold uppercase">Tap Here</span>
               </>
           )}
        </button>

        {/* Stats Display */}
        <div className="w-full grid grid-cols-2 gap-3">
           <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Laya (Speed)</span>
              <span className="text-xs font-bold text-primary">{taps.length > 1 ? laya.split('(')[0] : '-'}</span>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> Flow</span>
              <span className="text-xs font-bold text-amber-500">{taps.length > 1 ? stability : '-'}</span>
           </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full pt-2">
           <GlassButton onClick={handleReset} variant="subtle" className="flex-1" size="sm">
              <RotateCcw className="w-4 h-4" /> Reset
           </GlassButton>
           <GlassButton 
              onClick={handleConfirm} 
              variant="primary" 
              className="flex-[2]" 
              size="sm"
              disabled={taps.length < 4}
           >
              <Check className="w-4 h-4" /> Apply Rhythm
           </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
