
import React, { useMemo } from "react";

interface MoodBackgroundProps {
  mood: string;
}

export const MoodBackground = ({ mood }: MoodBackgroundProps) => {
  const getColors = (m: string) => {
    const lower = m.toLowerCase();

    // Warm / Happy / Energetic
    if (lower.includes('happy') || lower.includes('joy') || lower.includes('playful')) {
      return ['bg-yellow-400/30', 'bg-orange-400/30', 'bg-pink-400/30'];
    }
    if (lower.includes('energetic') || lower.includes('party') || lower.includes('dance')) {
      return ['bg-purple-500/30', 'bg-fuchsia-500/30', 'bg-blue-500/30'];
    }

    // Cool / Sad / Peaceful
    if (lower.includes('sad') || lower.includes('melancholic') || lower.includes('pathos')) {
      return ['bg-blue-400/30', 'bg-indigo-400/30', 'bg-slate-400/30'];
    }
    if (lower.includes('peaceful') || lower.includes('nature') || lower.includes('meditative')) {
      return ['bg-emerald-400/30', 'bg-teal-400/30', 'bg-cyan-400/30'];
    }

    // Intense / Romantic / Dark
    if (lower.includes('romantic') || lower.includes('love')) {
      return ['bg-rose-400/30', 'bg-pink-500/30', 'bg-red-400/30'];
    }
    if (lower.includes('angry') || lower.includes('horror') || lower.includes('dark')) {
      return ['bg-red-900/40', 'bg-slate-800/60', 'bg-orange-900/40'];
    }
    if (lower.includes('devotional')) {
      return ['bg-amber-300/30', 'bg-yellow-200/30', 'bg-orange-300/30'];
    }

    // Default Modern Gradient (Liquid Glass Brand Colors)
    // Using opacity to ensure it's not too overwhelming behind glass components
    return ['bg-primary/20', 'bg-accent/20', 'bg-purple-500/20'];
  };

  const [color1, color2, color3] = useMemo(() => getColors(mood), [mood]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-1000">

      {/* Animated Blob 1 */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] ${color1} rounded-full mix-blend-multiply filter blur-[80px] md:blur-[128px] opacity-60 animate-blob dark:mix-blend-screen dark:opacity-20`}></div>

      {/* Animated Blob 2 */}
      <div className={`absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] ${color2} rounded-full mix-blend-multiply filter blur-[80px] md:blur-[128px] opacity-60 animate-blob animation-delay-2000 dark:mix-blend-screen dark:opacity-20`}></div>

      {/* Animated Blob 3 */}
      <div className={`absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] ${color3} rounded-full mix-blend-multiply filter blur-[80px] md:blur-[128px] opacity-60 animate-blob animation-delay-4000 dark:mix-blend-screen dark:opacity-20`}></div>

      {/* Noise Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />
    </div>
  );
};