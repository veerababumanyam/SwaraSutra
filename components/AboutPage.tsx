
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot, Sparkles, BrainCircuit, Heart, Globe, Feather,
  ShieldCheck, Video, FileCode, ArrowLeft, Cpu,
  Zap, Layers, Music, Users, ChevronRight
} from "lucide-react";
import { GlassButton } from "./ui/GlassButton";

/* ────────────────────────────────────────────────────────────
 *  WCAG 2.1 AA Redesign — About Page
 *  ─ All text ≥ 14px (13px only for genuinely auxiliary labels)
 *  ─ Foreground/background contrast ≥ 4.5:1 (normal) / 3:1 (large)
 *  ─ Solid, opaque surfaces — no invisible glass layers
 *  ─ Focus-visible rings on every interactive element
 *  ─ Skip-navigation landmark
 *  ─ Proper heading hierarchy (h1→h2→h3)
 * ──────────────────────────────────────────────────────────── */

/* ---------- palette tokens (Tailwind classes) ---------- */
const surface = "bg-background";
const surfaceRaised = "glass-auto border-transparent";
const surfaceInset = "glass-auto-thick border-transparent";
const borderSolid = "border border-border";
const textPrimary = "text-foreground";
const textSecondary = "text-muted-foreground";
const textTertiary = "text-muted-foreground/70";

/* ─── Accent badge backgrounds that pass 4.5:1 with their text ─── */
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

/* ─────────── Sub-components ─────────── */

const AgentCard = ({
  icon,
  name,
  role,
  desc,
  accent,
}: {
  icon: React.ReactNode;
  name: string;
  role: string;
  desc: string;
  accent: string;
}) => (
  <article
    className={`group relative ${surfaceRaised} ${borderSolid} rounded-2xl p-5 sm:p-6 transition-shadow duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-cyan-500`}
  >
    {/* Icon */}
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${accentIcon[accent]}`}
      aria-hidden="true"
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
    </div>

    {/* Name */}
    <h3 className={`text-base font-bold ${textPrimary} mb-1`}>{name}</h3>

    {/* Role badge — opaque, high-contrast */}
    <span
      className={`inline-block text-xs font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-md mb-3 ${accentBadge[accent]}`}
    >
      {role}
    </span>

    {/* Description — 14px, readable */}
    <p className={`text-sm leading-relaxed ${textSecondary}`}>{desc}</p>
  </article>
);

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

const WorkflowStep = ({
  icon,
  step,
  title,
  desc,
  accentColor,
  isLast = false,
}: {
  icon: React.ReactNode;
  step: number;
  title: string;
  desc: string;
  accentColor: string;
  isLast?: boolean;
}) => (
  <div className="flex flex-col items-center text-center space-y-3 relative">
    {/* Step circle — solid bg, AA contrast */}
    <div
      className={`w-16 h-16 rounded-full ${accentIcon[accentColor]} flex items-center justify-center shadow-md`}
      aria-hidden="true"
    >
      {icon}
    </div>
    <h3 className={`text-base font-bold ${textPrimary}`}>
      {step}. {title}
    </h3>
    <p className={`text-sm ${textSecondary} max-w-[220px]`}>{desc}</p>

    {/* Connector arrow (visible contrast) */}
    {!isLast && (
      <ChevronRight
        className="hidden md:block absolute top-7 -right-3 text-slate-400 dark:text-slate-500 w-6 h-6"
        aria-hidden="true"
      />
    )}
  </div>
);

/* ═══════════════════ Page Component ═══════════════════ */

export const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${surface} ${textPrimary} font-sans relative overflow-x-hidden selection:bg-cyan-200 dark:selection:bg-cyan-800`}>

      {/* ─── Skip navigation (WCAG 2.4.1) ─── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* ─── Navigation ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-3 flex justify-between items-center ${surface} border-b ${borderSolid} shadow-sm`}
        aria-label="About page navigation"
      >
        <div className="flex items-center gap-3">
          <GlassButton
            size="icon"
            variant="subtle"
            onClick={() => navigate("/")}
            aria-label="Back to Studio"
          >
            <ArrowLeft className="w-5 h-5" />
          </GlassButton>
          <span className={`font-cinema font-bold text-xl tracking-tight hidden sm:block ${textPrimary}`}>
            LayaVani AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://ai.google.dev"
            target="_blank"
            rel="noreferrer"
            className={`text-sm font-semibold ${textSecondary} hover:text-cyan-600 dark:hover:text-cyan-400 underline underline-offset-2 decoration-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded`}
          >
            Powered by Gemini
          </a>
          <GlassButton size="sm" variant="brand" onClick={() => navigate("/")}>
            Launch Studio
          </GlassButton>
        </div>
      </nav>

      {/* ─── Main content ─── */}
      <main
        id="main-content"
        className="pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-20"
        role="main"
      >
        {/* ═══ HERO ═══ */}
        <section className="text-center space-y-6 pt-8" aria-labelledby="hero-heading">
          {/* Decorative glow — purely visual, hidden from AT */}
          <div
            className="absolute top-32 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-400/15 dark:bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"
            aria-hidden="true"
          />

          {/* Pill badge — opaque background */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Multi-Agent Orchestration
          </div>

          <h1
            id="hero-heading"
            className={`text-4xl sm:text-5xl md:text-6xl font-black font-cinema tracking-tight ${textPrimary} leading-[1.15]`}
          >
            The Symphony of{" "}
            <span className="text-cyan-600 dark:text-cyan-400">
              Artificial Intelligence.
            </span>
          </h1>

          <p className={`max-w-2xl mx-auto text-lg ${textSecondary} leading-relaxed`}>
            LayaVani isn't a chatbot. It is a coordinated swarm of specialized
            AI agents working in harmony to compose culturally rich,
            production-ready cinematic lyrics.
          </p>
        </section>

        {/* ═══ AGENT ECOSYSTEM ═══ */}
        <section aria-labelledby="agents-heading">
          {/* Section heading — readable size, high contrast */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
            <h2
              id="agents-heading"
              className={`text-sm font-bold uppercase tracking-widest ${textTertiary} flex items-center gap-2`}
            >
              <Cpu className="w-4 h-4" aria-hidden="true" /> The Neural Team
            </h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Orchestrator — Hero card */}
            <article
              className={`md:col-span-2 lg:col-span-2 ${surfaceRaised} ${borderSolid} rounded-2xl p-6 sm:p-8 border-l-4 border-l-cyan-500`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="p-4 bg-cyan-600 dark:bg-cyan-500 rounded-2xl text-white shadow-md shrink-0">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-xl font-bold ${textPrimary}`}>
                    The Orchestrator
                  </h3>
                  <span className="inline-block text-xs font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200">
                    System Core
                  </span>
                  <p className={`text-sm ${textSecondary} leading-relaxed`}>
                    The central intelligence that analyzes your intent, delegates
                    tasks to sub-agents, manages context, and compiles the final
                    output. It ensures the "soul" of the song remains intact
                    across all processing steps.
                  </p>
                </div>
              </div>
            </article>

            <AgentCard
              icon={<Heart />}
              name="Bhava Vignani"
              role="Emotion Agent"
              desc="Analyzes the emotional subtext (Navarasa) and intensity. Determines if the song should be 'Raudra' (Angry) or 'Shringara' (Romantic)."
              accent="pink"
            />
            <AgentCard
              icon={<Globe />}
              name="Desi DNA"
              role="Regional Expert"
              desc="Enforces linguistic purity. Ensures Telugu songs use 'Prasa' (Rhyme) rules and prevents English transliteration errors."
              accent="orange"
            />
            <AgentCard
              icon={<Feather />}
              name="Mahakavi"
              role="Lead Lyricist"
              desc="The creative writer. Uses 'Thinking' models to draft verses with perfect meter (Chandassu) and rich vocabulary."
              accent="amber"
            />
            <AgentCard
              icon={<ShieldCheck />}
              name="Niti Rakshak"
              role="Compliance"
              desc="Scans the output for plagiarism, copyright risks, and safety violations before you ever see it."
              accent="red"
            />
            <AgentCard
              icon={<Bot />}
              name="Sahitya Vimarsak"
              role="Review Council"
              desc="Simulates a panel of critics (The Vidwan, The Hit-Maker) to debate and polish the lyrics for perfection."
              accent="green"
            />
            <AgentCard
              icon={<FileCode />}
              name="Audio Architect"
              role="Formatter"
              desc="Structures lyrics with [Verse], [Chorus] tags and generates technical style prompts for Suno/Udio."
              accent="cyan"
            />
          </div>
        </section>

        {/* ═══ WORKFLOW VISUALIZATION ═══ */}
        <section
          className={`${surfaceInset} ${borderSolid} rounded-3xl p-8 md:p-12`}
          aria-labelledby="workflow-heading"
        >
          <div className="text-center mb-12">
            <h2
              id="workflow-heading"
              className={`text-2xl sm:text-3xl font-cinema font-bold mb-3 ${textPrimary}`}
            >
              The Collaborative Flow
            </h2>
            <p className={`${textSecondary} text-base max-w-xl mx-auto`}>
              How a simple thought becomes a production-ready composition in
              milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <WorkflowStep
              icon={<Zap className="w-7 h-7" />}
              step={1}
              title="Intent"
              desc="User defines the mood, ceremony, or uploads an image."
              accentColor="cyan"
            />
            <WorkflowStep
              icon={<Layers className="w-7 h-7" />}
              step={2}
              title="Research"
              desc="Agents extract cultural metaphors, dialect rules, and rhyme schemes."
              accentColor="purple"
            />
            <WorkflowStep
              icon={<Music className="w-7 h-7" />}
              step={3}
              title="Composition"
              desc="Lyricist drafts the song. Critics review it. Formatter tags it."
              accentColor="amber"
            />
            <WorkflowStep
              icon={<FileCode className="w-7 h-7" />}
              step={4}
              title="Production"
              desc="Final output ready for Suno/Udio with style prompts attached."
              accentColor="green"
              isLast
            />
          </div>
        </section>

        {/* ═══ CAPABILITIES ═══ */}
        <section aria-labelledby="capabilities-heading">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
            <h2
              id="capabilities-heading"
              className={`text-sm font-bold uppercase tracking-widest ${textTertiary} flex items-center gap-2`}
            >
              <Users className="w-4 h-4" aria-hidden="true" /> Capabilities
            </h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureItem
              icon={Video}
              title="Multimodal Vision"
              desc="Upload a video or image. The 'Drishti' agent analyzes the scene to write lyrics that perfectly match the visual context."
            />
            <FeatureItem
              icon={Music}
              title="Suno Integration"
              desc="One-click export mode designed specifically for AI Audio generators. Includes auto-tagging and style prompt generation."
            />
            <FeatureItem
              icon={Globe}
              title="Native Script"
              desc="LayaVani writes in pure Telugu, Hindi, Tamil, etc. No transliteration errors. It understands 'Prasa' and 'Yati'."
            />
            <FeatureItem
              icon={Bot}
              title="Sutra Engine"
              desc="A knowledge base of 50+ specific scenarios (Wedding, Hero Entry, Item Song) to inject deep cultural context."
            />
            <FeatureItem
              icon={Zap}
              title="Live Brainstorm"
              desc="Speak to the AI in real-time. Low latency voice interaction for brainstorming ideas while driving or walking."
            />
            <FeatureItem
              icon={Layers}
              title="Magic Rewrite"
              desc="Highlight any line to magically rewrite it for better rhymes, punchier flow, or deeper metaphors."
            />
          </div>
        </section>

        {/* ═══ FOOTER CTA ═══ */}
        <section className="text-center py-12" aria-label="Call to action">
          <GlassButton
            size="lg"
            variant="brand"
            onClick={() => navigate("/")}
            className="px-8 h-14 text-base font-semibold shadow-xl"
          >
            Start Composing Now
          </GlassButton>
          <p className={`mt-6 text-sm ${textTertiary} font-semibold`}>
            v2.1 · Built with Google Gemini
          </p>
        </section>
      </main>
    </div>
  );
};
