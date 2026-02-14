
import React, { useState } from "react";
import { Search, Loader2, BookOpen, Languages, Sparkles } from "lucide-react";
import { GlassInput } from "../ui/GlassInput";
import { GlassButton } from "../ui/GlassButton";
import { runDictionaryAgent } from "../../agents/dictionary";
import { useStudio } from "../../contexts/StudioContext";
import { DictionaryResult } from "../../types";

export const DictionaryTool = () => {
   const { languageSettings, appearance } = useStudio();
   const [word, setWord] = useState("");
   const [result, setResult] = useState<DictionaryResult | null>(null);
   const [loading, setLoading] = useState(false);
   const [context, setContext] = useState("Cinematic Song Lyrics");

   const handleSearch = async () => {
      if (!word.trim()) return;
      setLoading(true);
      try {
         const data = await runDictionaryAgent(
            word,
            languageSettings.primary,
            context,
            appearance.agentModels.DICTIONARY
         );
         setResult(data);
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-4">
         <div className="flex gap-2">
            <GlassInput
               placeholder={`Search ${languageSettings.primary} word...`}
               value={word}
               onChange={(e) => setWord(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
               className="text-xs"
            />
            <GlassButton onClick={handleSearch} disabled={loading} size="icon" variant="primary">
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </GlassButton>
         </div>

         <div className="space-y-1">
            <label className="text-[9px] uppercase font-black text-slate-700 dark:text-slate-300 tracking-widest">Context</label>
            <select
               value={context}
               onChange={(e) => setContext(e.target.value)}
               className="w-full bg-white dark:bg-slate-900 border-2 border-slate-900/20 dark:border-white/30 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors appearance-none cursor-pointer shadow-sm"
            >
               <option className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold" value="Cinematic Song Lyrics">Cinematic Lyrics</option>
               <option className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold" value="Classical Poetry">Classical Poetry</option>
               <option className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold" value="Street Slang/Mass">Street Slang / Mass</option>
               <option className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold" value="Modern Romantic">Modern Romantic</option>
            </select>
         </div>

         {result && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-3 animate-in fade-in slide-in-from-bottom-2">
               <div className="flex justify-between items-start border-b border-white/10 pb-2">
                  <div>
                     <h4 className="font-black text-lg text-primary capitalize">{result.word}</h4>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{result.language}</span>
                  </div>
                  {result.transliteration && (
                     <div className="text-right">
                        <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{result.transliteration}</span>
                     </div>
                  )}
               </div>

               <div className="space-y-2">
                  <div>
                     <h5 className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                        <BookOpen className="w-3 h-3" /> Synonyms (Paryaya)
                     </h5>
                     <div className="flex flex-wrap gap-1.5">
                        {result.synonyms.map((s, i) => (
                           <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs hover:bg-white/10 cursor-pointer">{s}</span>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h5 className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                        <Languages className="w-3 h-3" /> Rhymes (Prasa)
                     </h5>
                     <div className="flex flex-wrap gap-1.5">
                        {result.rhymes.map((s, i) => (
                           <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs hover:bg-primary/20 cursor-pointer">{s}</span>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h5 className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3" /> Metaphors
                     </h5>
                     <ul className="space-y-1">
                        {result.metaphors.map((s, i) => (
                           <li key={i} className="text-xs italic text-slate-800 dark:text-slate-200 font-medium">"{s}"</li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
