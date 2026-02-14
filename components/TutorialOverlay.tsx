
import React, { useEffect, useState } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles, Wand2, Bot, Languages, Music } from "lucide-react";
import { useStudio } from "../contexts/StudioContext";

interface Step {
  title: string;
  content: string;
  targetId: string;
  position: 'center' | 'right' | 'top' | 'bottom' | 'left';
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Welcome to swarasutra",
    content: "Welcome to the world's first Multi-Agent Lyric Studio for Indian Cinema. We don't just write words; we weave resonant cinematic threads. Ready for a quick tour?",
    targetId: "studio-welcome-center",
    position: "bottom",
    icon: <Sparkles className="w-6 h-6 text-primary" />
  },
  {
    title: "Your Creative Console",
    content: "The Sidebar is where you define the 'DNA' of your song. Everything from context to rhyming schemes is managed here.",
    targetId: "tutorial-sidebar",
    position: "right",
    icon: <Bot className="w-6 h-6 text-primary" />
  },
  {
    title: "The Sutra Engine",
    content: "Select specific ceremonies like 'Jeelakarra Bellam' or cinematic tropes like 'Hero Intro'. This anchors the AI in deep cultural metaphors.",
    targetId: "tutorial-context-engine",
    position: "right",
    icon: <Music className="w-6 h-6 text-primary" />
  },
  {
    title: "Language & Script Mix",
    content: "Configure your primary and secondary languages. swarasutra writes in TRUE Native Script (Telugu, Hindi, etc.)—never messy transliteration.",
    targetId: "tutorial-language-mix",
    position: "right",
    icon: <Languages className="w-6 h-6 text-primary" />
  },
  {
    title: "Direct the Orchestrator",
    content: "Type your song idea here. You can even upload an image! The Orchestrator will then coordinate 7 specialized AI agents to generate your hit.",
    targetId: "studio-input-area",
    position: "top",
    icon: <Bot className="w-6 h-6 text-primary" />
  },
  {
    title: "The Sutra Protocol",
    content: "When you start, watch the 'Workflow Status' to see the Emotion, Research, and Lyricist agents working in perfect harmony.",
    targetId: "tutorial-workflow-area",
    position: "center",
    icon: <Bot className="w-6 h-6 text-primary" />
  },
  {
    title: "Magic Prasa & Dhwani",
    content: "Once lyrics appear, use 'Prasa Fix' to polish rhymes or 'Dhwani' to hear a soulful AI recitation. Your studio session is now ready!",
    targetId: "studio-input-area", // Pointing back to input as a proxy for the card since we can't guarantee a card is there
    position: "top",
    icon: <Wand2 className="w-6 h-6 text-primary" />
  }
];

export const TutorialOverlay: React.FC = () => {
  const { tutorialActive, setTutorialActive, tutorialStep, setTutorialStep, setIsSidebarOpen } = useStudio();
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const currentStep = STEPS[tutorialStep];

  useEffect(() => {
    if (!tutorialActive) return;

    // Side effects for steps
    if (tutorialStep >= 1 && tutorialStep <= 3) {
      setIsSidebarOpen(true);
    }

    const updatePosition = () => {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      } else {
        setCoords({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [tutorialStep, tutorialActive, currentStep.targetId, setIsSidebarOpen]);

  if (!tutorialActive) return null;

  const handleNext = () => {
    if (tutorialStep < STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const handleComplete = () => {
    setTutorialActive(false);
    localStorage.setItem("swarasutra_tutorial_completed", "true");
  };

  const getTooltipStyles = () => {
    if (currentStep.position === 'center') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const padding = 20;
    const tooltipWidth = Math.min(320, window.innerWidth * 0.85);
    const maxLeft = window.innerWidth - tooltipWidth - 12;
    const minLeft = 12;

    switch (currentStep.position) {
      case 'right': {
        const idealLeft = coords.left + coords.width + padding;
        // On mobile, if tooltip would go off-screen, position below instead
        if (idealLeft + tooltipWidth > window.innerWidth) {
          return {
            top: coords.top + coords.height + padding,
            left: Math.max(minLeft, Math.min(maxLeft, coords.left + coords.width / 2 - tooltipWidth / 2))
          };
        }
        return { top: coords.top, left: idealLeft };
      }
      case 'top':
        return {
          top: coords.top - padding,
          left: Math.max(minLeft, Math.min(maxLeft, coords.left + coords.width / 2 - tooltipWidth / 2)),
          transform: 'translateY(-100%)'
        };
      case 'bottom':
        return {
          top: coords.top + coords.height + padding,
          left: Math.max(minLeft, Math.min(maxLeft, coords.left + coords.width / 2 - tooltipWidth / 2))
        };
      case 'left': {
        const idealLeft = coords.left - padding;
        // On mobile, if tooltip would go off-screen, position below instead
        if (idealLeft - tooltipWidth < 0) {
          return {
            top: coords.top + coords.height + padding,
            left: Math.max(minLeft, Math.min(maxLeft, coords.left + coords.width / 2 - tooltipWidth / 2))
          };
        }
        return { top: coords.top, left: idealLeft, transform: 'translateX(-100%)' };
      }
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      {/* Dimmed Backdrop with Spotlight Hole */}
      <div
        className="absolute inset-0 bg-black/60 transition-all duration-500 pointer-events-auto"
        style={{
          clipPath: currentStep.position === 'center'
            ? 'none'
            : `polygon(0% 0%, 0% 100%, ${coords.left}px 100%, ${coords.left}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top + coords.height}px, ${coords.left}px ${coords.top + coords.height}px, ${coords.left}px 100%, 100% 100%, 100% 0%)`
        }}
      />

      {/* Pulsing Highlight Box */}
      {currentStep.position !== 'center' && (
        <div
          className="absolute border-2 border-primary rounded-xl shadow-[0_0_15px_rgba(230,57,70,0.5)] animate-pulse transition-all duration-500"
          style={{
            top: coords.top - 4,
            left: coords.left - 4,
            width: coords.width + 8,
            height: coords.height + 8
          }}
        />
      )}

      {/* Tooltip Card */}
      <div
        className="absolute w-[85vw] sm:w-80 glass-thick border border-border shadow-2xl rounded-2xl p-4 sm:p-6 pointer-events-auto transition-all duration-500 animate-in zoom-in-95 fade-in"
        style={getTooltipStyles()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {currentStep.icon}
          </div>
          <h4 className="font-cinema font-bold text-lg leading-tight uppercase italic">{currentStep.title}</h4>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {currentStep.content}
        </p>

        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handleComplete}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>

          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === tutorialStep ? 'w-4 bg-primary' : 'w-1.5 bg-secondary'}`} />
            ))}
          </div>

          <div className="flex gap-2">
            {tutorialStep > 0 && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20"
            >
              {tutorialStep === STEPS.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
