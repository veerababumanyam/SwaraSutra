
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Bot, Sparkles, BrainCircuit, Heart, Globe, Feather,
    ShieldCheck, Video, FileCode, ArrowLeft, Cpu,
    Zap, Layers, Music, Users, ChevronRight, PlayCircle
} from "lucide-react";
import { GlassButton } from "./ui/GlassButton";

const surface = "bg-background";
const surfaceRaised = "glass-auto border-transparent";
const surfaceInset = "glass-auto-thick border-transparent";
const borderSolid = "border border-border";
const textPrimary = "text-foreground";
const textSecondary = "text-muted-foreground";
const textTertiary = "text-muted-foreground/70";

const accentBadge: Record<string, string> = {
    pink: "bg-pink-100  dark:bg-pink-900/50  text-pink-800  dark:text-pink-200",
    orange: "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200",
    amber: "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200",
    red: "bg-red-100   dark:bg-red-900/50   text-red-800   dark:text-red-200",
    green: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200",
    cyan: "bg-cyan-100  dark:bg-cyan-900/50  text-cyan-800  dark:text-cyan-200",
    purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200",
};

const accentIcon: Record<string, string> = {
    pink: "bg-pink-200 dark:bg-pink-800 text-pink-700 dark:text-pink-100",
    orange: "bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-100",
    amber: "bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-100",
    red: "bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-100",
    green: "bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-100",
    cyan: "bg-cyan-200 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-100",
    purple: "bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-100",
};

const FeatureItem = ({
    icon,
    title,
    desc,
}: {
    icon: React.ElementType;
    title: string;
    desc: string;
}) => (
    <div
        className={`flex gap-4 p-5 rounded-xl ${surfaceRaised} ${borderSolid} transition-shadow hover:shadow-md`}
    >
        <div
            className="shrink-0 w-11 h-11 rounded-full bg-cyan-100 dark:bg-cyan-900/60 flex items-center justify-center text-cyan-700 dark:text-cyan-200"
            aria-hidden="true"
        >
            {React.createElement(icon, { className: "w-5 h-5" })}
        </div>
        <div>
            <h3 className={`font-semibold ${textPrimary} text-base mb-1`}>{title}</h3>
            <p className={`text-sm ${textSecondary} leading-relaxed`}>{desc}</p>
        </div>
    </div>
);

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen ${surface} ${textPrimary} font-sans relative overflow-x-hidden selection:bg-cyan-200 dark:selection:bg-cyan-800`}>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 px-6 py-3 flex justify-between items-center bg-background/80 backdrop-blur-md border-b ${borderSolid} shadow-sm`}
                aria-label="Root navigation"
            >
                <div className="flex items-center gap-3">
                    <span className={`font-cinema font-bold text-xl tracking-tight ${textPrimary}`}>
                        swarasutra AI
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <GlassButton size="sm" variant="brand" onClick={() => navigate("/studio")}>
                        Enter Studio
                    </GlassButton>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-32">
                {/* HERO SECTION */}
                <section className="text-center space-y-8 max-w-4xl mx-auto">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300"
                    >
                        <Sparkles className="w-4 h-4" />
                        The Future of Indian Music Composition
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black font-cinema tracking-tight leading-[1.05]">
                        Orchestrating <span className="text-cyan-600">Cinematic Soul</span> through AI.
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed">
                        swarasutra is a specialized multi-agent AI environment designed for the unique demands of Indian Cinema. From Tollywood's poetic depth to Bollywood's rhythmic energy, we compose lyrics that resonate.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <GlassButton size="lg" variant="brand" onClick={() => navigate("/studio")} className="h-16 px-10 text-lg">
                            Start Writing Now
                        </GlassButton>
                        <GlassButton size="lg" variant="subtle" onClick={() => navigate("/about")} className="h-16 px-10 text-lg">
                            How it Works
                        </GlassButton>
                    </div>
                </section>

                {/* KEY FEATURES */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureItem
                        icon={Globe}
                        title="Regional Linguistic Purity"
                        desc="Deep primary language support for Telugu, Hindi, Tamil, Kannada, and Malayalam. We respect Chandassu and Prasa rules."
                    />
                    <FeatureItem
                        icon={BrainCircuit}
                        title="Multi-Agent Brain"
                        desc="A coordinated team of specialized AI agents (Emotion, Regional, Critic) working in sync for your masterpiece."
                    />
                    <FeatureItem
                        icon={Video}
                        title="Multimodal Vision"
                        desc="Upload a scene or image. Our agents 'see' the emotion and write lyrics that perfectly sync with your visuals."
                    />
                    <FeatureItem
                        icon={Music}
                        title="Suno/Udio Optimized"
                        desc="Direct formatting for AI music generators, including technical style prompts and structure tags."
                    />
                    <FeatureItem
                        icon={Zap}
                        title="Real-time Brainstorming"
                        desc="Voice-enabled live sessions for when the melody hits you on the go. Low-latency, high-context."
                    />
                    <FeatureItem
                        icon={Layers}
                        title="Deep Meta-Context"
                        desc="Context-aware knowledge base for specific cinematographic tropes (Hero Entry, Item Song, Wedding)."
                    />
                </section>

                {/* TRUST/SEO SECTION */}
                <section className="text-center space-y-12">
                    <h2 className="text-3xl font-bold font-cinema">Why leading creators choose swarasutra</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 grayscale opacity-70">
                        <div className="p-4 border rounded-xl flex items-center justify-center font-bold text-2xl tracking-widest italic">TOLLYWOOD</div>
                        <div className="p-4 border rounded-xl flex items-center justify-center font-bold text-2xl tracking-widest italic">BOLLYWOOD</div>
                        <div className="p-4 border rounded-xl flex items-center justify-center font-bold text-2xl tracking-widest italic">KOLLYWOOD</div>
                        <div className="p-4 border rounded-xl flex items-center justify-center font-bold text-2xl tracking-widest italic">SANDALWOOD</div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className={`rounded-3xl p-12 md:p-20 text-center space-y-8 bg-cyan-600 text-white shadow-2xl relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <h2 className="text-4xl md:text-5xl font-black">Ready to compose your next hit?</h2>
                    <p className="text-xl text-cyan-50/80 max-w-2xl mx-auto">
                        Join the elite circle of music directors and lyricists using AI to push the boundaries of Indian cinematic music.
                    </p>
                    <GlassButton size="lg" onClick={() => navigate("/studio")} className="bg-white text-cyan-600 hover:bg-cyan-50 h-16 px-12 text-lg font-bold shadow-xl border-none">
                        Launch Studio AI
                    </GlassButton>
                </section>
            </main>

            <footer className={`py-12 border-t ${borderSolid} text-center`}>
                <div className="flex justify-center gap-8 mb-6">
                    <a href="#" className="text-sm font-semibold text-muted-foreground hover:text-cyan-600">Twitter</a>
                    <a href="#" className="text-sm font-semibold text-muted-foreground hover:text-cyan-600">Discord</a>
                    <a href="#" className="text-sm font-semibold text-muted-foreground hover:text-cyan-600">Documentation</a>
                    <button onClick={() => navigate("/architect")} className="text-sm font-semibold text-muted-foreground hover:text-cyan-600">System Architecture</button>
                </div>
                <p className="text-sm text-muted-foreground">
                    © 2026 swarasutra AI. Built for the future of Indian Cinema.
                </p>
            </footer>
        </div>
    );
};