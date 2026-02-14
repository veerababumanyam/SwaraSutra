export type WorkflowScope = "global" | "song" | "editor";

export class WorkflowCanceledError extends Error {
  constructor(message: string = "Workflow canceled") {
    super(message);
    this.name = "WorkflowCanceledError";
  }
}

export interface WorkflowRun {
  id: string;
  scope: WorkflowScope;
  key: string;
  canceled: boolean;
  cancel: (reason?: string) => void;
  throwIfCanceled: () => void;
}

interface WorkflowState {
  run: WorkflowRun | null;
  inFlight: Promise<any> | null;
  lastKey: string | null;
  lastKeyAt: number;
}

interface StartOptions {
  latestOnly?: boolean;
  dedupeMs?: number;
}

class WorkflowController {
  private states = new Map<WorkflowScope, WorkflowState>();

  private getState(scope: WorkflowScope): WorkflowState {
    const existing = this.states.get(scope);
    if (existing) return existing;
    const state: WorkflowState = { run: null, inFlight: null, lastKey: null, lastKeyAt: 0 };
    this.states.set(scope, state);
    return state;
  }

  start<T>(
    scope: WorkflowScope,
    key: string,
    task: (run: WorkflowRun) => Promise<T>,
    options: StartOptions = {}
  ): Promise<T> {
    const { latestOnly = true, dedupeMs = 1500 } = options;
    const state = this.getState(scope);
    const now = Date.now();

    if (state.lastKey === key && state.inFlight && now - state.lastKeyAt < dedupeMs) {
      return state.inFlight as Promise<T>;
    }

    if (latestOnly && state.run && !state.run.canceled) {
      state.run.cancel("Superseded by newer request");
    }

    const runId = `${scope}-${now}-${Math.random().toString(36).slice(2, 8)}`;
    const run: WorkflowRun = {
      id: runId,
      scope,
      key,
      canceled: false,
      cancel: (reason?: string) => {
        run.canceled = true;
        if (reason) {
          (run as any).reason = reason;
        }
      },
      throwIfCanceled: () => {
        if (run.canceled) {
          throw new WorkflowCanceledError((run as any).reason || "Workflow canceled");
        }
      }
    };

    const promise = (async () => {
      try {
        const result = await task(run);
        return result;
      } finally {
        if (state.run?.id === run.id) {
          state.run = null;
          state.inFlight = null;
        }
      }
    })();

    state.run = run;
    state.inFlight = promise;
    state.lastKey = key;
    state.lastKeyAt = now;

    return promise;
  }
}

export const workflowController = new WorkflowController();
