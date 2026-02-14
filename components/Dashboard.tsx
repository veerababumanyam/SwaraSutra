
import React from 'react';
import { Plus, Music, Sparkles, FolderOpen, Mic2, ArrowRight, Wand2, PlayCircle, Star } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { GlassButton } from './ui/GlassButton';
import { useStudio } from '../contexts/StudioContext';
import { APP_NAME, APP_TAGLINE } from '../constants';

interface DashboardProps {
   onNewChat: (prompt?: string) => void;
   onOpenLive: () => void;
   onLoadProject: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNewChat, onOpenLive, onLoadProject }) => {
   const { projects, savedSongs, languageSettings } = useStudio();
   const recentSongs = savedSongs.slice(0, 3);
   const lang = languageSettings.primary || "Telugu";

   const templates = [
      { title: "Hero Entry", icon: "🦁", color: "from-amber-500 to-orange-600", prompt: `Write a high-energy Hero Introduction song in ${lang} (Native Script). Theme: Fire and Power. Style: Mass Beat.` },
      { title: "Love Melody", icon: "❤️", color: "from-pink-500 to-rose-600", prompt: `Write a romantic melody about first love at a coffee shop in ${lang} (Native Script). Style: Acoustic Pop.` },
      { title: "Devotional", icon: "🙏", color: "from-indigo-500 to-blue-600", prompt: `Write a powerful devotional hymn for Lord Shiva in ${lang} (Native Script). Structure: Dandakam.` },
      { title: "Rap Battle", icon: "🎤", color: "from-purple-500 to-violet-600", prompt: `Write a playful rap battle between a city boy and a village girl in ${lang} (Native Script).` },
   ];

   return (
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

         {/* ─── Hero Section ─── */}
         <div className="relative overflow-hidden rounded-[var(--radius-2xl)] glass-thick border border-white/20 p-4 sm:p-6 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-accent/30 transition-colors duration-1000" />

            <div className="relative z-10 space-y-6 max-w-2xl">
               <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full glass-bordered bg-primary/5 border-primary/20 text-primary text-xs font-black uppercase tracking-widest shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Music Orchestration Engine</span>
               </div>

               <div className="space-y-4">
                  <h1 className="text-3xl md:text-6xl lg:text-7xl font-black font-cinema tracking-tighter text-foreground drop-shadow-md leading-tight">
                     Compose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-text-shimmer bg-[length:200%_auto]">Masterpiece.</span>
                  </h1>
                  <p className="text-base md:text-xl text-muted-foreground font-medium leading-relaxed max-w-lg">
                     {APP_TAGLINE}. Architect production-ready lyrics with a specialized multi-agent team.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <GlassButton size="lg" variant="brand" onClick={() => onNewChat()} className="shadow-xl shadow-primary/25 hover:shadow-primary/40 h-12 px-8 text-sm tracking-wide">
                     <Plus className="w-5 h-5" /> Start New Composition
                  </GlassButton>
                  <GlassButton size="lg" variant="subtle" onClick={onOpenLive} className="h-12 px-6 gap-2.5 text-sm tracking-wide bg-white/5 hover:bg-white/10">
                     <Mic2 className="w-5 h-5 text-red-500" /> Live Brainstorming
                  </GlassButton>
               </div>
            </div>

            {/* Visual Decoration (Optional, kept clean for now but could add an illustration) */}
            <div className="hidden md:block relative z-10 opacity-90">
               <div className="w-64 h-64 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shadow-2xl flex items-center justify-center border border-white/10 ring-1 ring-white/20 backdrop-blur-3xl">
                  <Music className="w-24 h-24 text-primary/20" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
               </div>
            </div>
         </div>

         {/* ─── Quick Start Templates ─── */}
         <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Instant Inspiration</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {templates.map((t, i) => (
                  <GlassCard
                     key={i}
                     interactive
                     onClick={() => onNewChat(t.prompt)}
                     className="flex flex-col gap-4 p-5 hover:-translate-y-1 transition-transform duration-300 group border-white/5 hover:border-primary/20"
                  >
                     <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-300`}>
                        {t.icon}
                     </div>
                     <div>
                        <h4 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors">{t.title}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold opacity-60">Start Template</p>
                     </div>
                  </GlassCard>
               ))}
            </div>
         </div>

         {/* ─── Recent Activity ─── */}
         <div className="grid md:grid-cols-2 gap-8">

            {/* Recent Songs */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                     <PlayCircle className="w-3.5 h-3.5" /> Recent Creations
                  </h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">View All</button>
               </div>

               {recentSongs.length > 0 ? (
                  <div className="space-y-3">
                     {recentSongs.map(song => (
                        <GlassCard key={song.id} interactive className="flex items-center justify-between p-3 group hover:bg-white/5 border-transparent hover:border-white/10">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/5 flex items-center justify-center text-primary group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                                 <Music className="w-6 h-6" />
                              </div>
                              <div className="min-w-0">
                                 <h4 className="font-bold text-sm text-foreground truncate">{song.title || "Untitled Composition"}</h4>
                                 <p className="text-[11px] text-muted-foreground font-medium">{new Date(song.timestamp).toLocaleDateString()} • {song.language.primary} </p>
                              </div>
                           </div>
                           <div className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                              <ArrowRight className="w-4 h-4" />
                           </div>
                        </GlassCard>
                     ))}
                  </div>
               ) : (
                  <div className="p-10 glass-bordered border-dashed border-white/10 rounded-[var(--radius-xl)] text-center flex flex-col items-center justify-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                        <Music className="w-5 h-5 text-muted-foreground/50" />
                     </div>
                     <p className="text-sm font-medium text-muted-foreground">Your canvas is empty.</p>
                     <GlassButton size="sm" variant="subtle" onClick={() => onNewChat()} className="text-xs">Start Composing</GlassButton>
                  </div>
               )}
            </div>

            {/* Projects */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                     <FolderOpen className="w-3.5 h-3.5" /> Film Projects
                  </h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">Manage</button>
               </div>

               {projects.length > 0 ? (
                  <div className="space-y-3">
                     {projects.slice(0, 3).map(proj => (
                        <GlassCard key={proj.id} interactive className="flex items-center justify-between p-3 group hover:bg-white/5 border-transparent hover:border-white/10">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-white/5 flex items-center justify-center text-amber-500 group-hover:from-amber-500/20 group-hover:to-orange-600/20 transition-colors">
                                 <FolderOpen className="w-6 h-6" />
                              </div>
                              <div className="min-w-0">
                                 <h4 className="font-bold text-sm text-foreground truncate">{proj.title}</h4>
                                 <p className="text-[11px] text-muted-foreground font-medium">{proj.songIds.length} Songs • Last Update {new Date(proj.timestamp).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                              <ArrowRight className="w-4 h-4" />
                           </div>
                        </GlassCard>
                     ))}
                  </div>
               ) : (
                  <div className="p-10 glass-bordered border-dashed border-white/10 rounded-[var(--radius-xl)] text-center flex flex-col items-center justify-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-muted-foreground/50" />
                     </div>
                     <p className="text-sm font-medium text-muted-foreground">Organize your songs into film projects.</p>
                  </div>
               )}
            </div>

         </div>
      </div>
   );
};
