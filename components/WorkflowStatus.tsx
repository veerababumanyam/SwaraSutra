
import React, { useState, useEffect } from "react";
import { Activity, Loader2, Clock, CheckCircle, XCircle, ChevronRight, Cpu } from "lucide-react";
import { AgentStatus } from "../types";
import { AGENT_SUBTASKS } from "../config";

export const WorkflowStatus = ({ status }: { status: AgentStatus }) => {
  const [elapsed, setElapsed] = useState(0);
  const [subtaskIndex, setSubtaskIndex] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    setElapsed(0);
    setSubtaskIndex(0);
    setProgress(5);
  }, [status.currentAgent]);

  useEffect(() => {
    if (!status.active) return;

    const interval = setInterval(() => {
      setElapsed(prev => prev + 0.1);
      setProgress(prev => {
        const remaining = 98 - prev;
        return prev + (remaining * 0.02);
      });

      const now = Date.now();
      const subtaskList = AGENT_SUBTASKS[status.currentAgent] || [];
      if (subtaskList.length > 0) {
        const newIndex = Math.floor(now / 1500) % subtaskList.length;
        setSubtaskIndex(newIndex);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [status.active, status.currentAgent]);

  const subtasks = AGENT_SUBTASKS[status.currentAgent] || ["Processing..."];
  const currentSubtask = subtasks[subtaskIndex % subtasks.length] || "Thinking...";

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200/60 dark:border-white/[0.08] shadow-xl backdrop-blur-2xl">

      {/* Header */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/[0.06] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <span className="text-cyan-600 dark:text-cyan-400 font-bold text-xs tracking-[0.1em] uppercase">
            Processing
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          <Clock className="w-3.5 h-3.5" />
          <span>{elapsed.toFixed(1)}s</span>
        </div>
      </div>

      {/* Agent name + subtask + progress */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">
              {status.currentAgent}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5" /> {currentSubtask}
            </p>
          </div>
          <span className="text-3xl font-mono font-bold text-slate-300 dark:text-white/20 leading-none tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-1 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-cyan-500 bg-[length:200%_100%] animate-shimmer rounded-full transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="bg-slate-50/50 dark:bg-black/20 max-h-40 overflow-y-auto scrollbar-thin border-t border-slate-100 dark:border-white/[0.04] py-1">
        {status.steps.map((step) => {
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';

          return (
            <div key={step.id} className={`px-4 py-1.5 flex items-center gap-3 transition-colors ${isActive ? 'bg-cyan-50/50 dark:bg-cyan-500/[0.04]' : ''}`}>
              <div className="relative flex items-center justify-center w-4 h-4 flex-shrink-0">
                {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                {isActive && <Loader2 className="w-3.5 h-3.5 text-cyan-500 animate-spin" />}
                {step.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />}
                {isFailed && <XCircle className="w-3.5 h-3.5 text-red-500" />}
              </div>
              <span className={`text-xs font-medium truncate ${isActive ? 'text-slate-900 dark:text-slate-100' :
                  isCompleted ? 'text-slate-500 dark:text-slate-400 line-through' :
                    'text-slate-600 dark:text-slate-500'
                }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
