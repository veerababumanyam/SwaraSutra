import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Copy, Check, Home, AlertOctagon } from "lucide-react";

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  scope?: string; // e.g., "Sidebar", "Chat", "Agent"
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  copied: boolean;
  diagnosticReport: string;
}

/**
 * swarasutra - Error Boundary
 * Catch rendering errors in child components.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      copied: false,
      diagnosticReport: ""
    };
  }

  // Static method to update state when an error is caught during rendering.
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      copied: false,
      diagnosticReport: ""
    };
  }

  // Lifecycle method for logging error information and updating the diagnostic report.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const report = this.generateDiagnosticReport(error, errorInfo);
    this.setState({ diagnosticReport: report });

    if (process.env.NODE_ENV === 'development') {
      console.group(`%c ErrorBoundary: ${this.props.scope || 'Root'} `, "background: #E63946; color: white; padding: 2px;");
      console.error("Error Detail:", error);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }
  }

  // Generates a JSON diagnostic report for troubleshooting.
  private generateDiagnosticReport(error: Error, errorInfo: ErrorInfo): string {
    return JSON.stringify({
      scope: this.props.scope || 'Root',
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      environment: {
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown'
      },
      componentStack: errorInfo.componentStack
    }, null, 2);
  }

  private copyErrorToClipboard = () => {
    if (this.state.diagnosticReport) {
      navigator.clipboard.writeText(this.state.diagnosticReport);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, diagnosticReport: "" });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.scope) {
        return (
          <div className="p-6 m-4 rounded-2xl bg-secondary/20 border border-border/50 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300 backdrop-blur-sm">
            <div className="p-3 bg-red-500/10 rounded-full text-red-500 ring-4 ring-red-500/5">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Component Error</h3>
              <p className="text-[11px] text-muted-foreground max-w-[240px] leading-relaxed italic">
                {this.props.scope} encountered an issue.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="text-xs px-4 py-2 bg-background border border-border hover:border-primary/30 text-foreground rounded-xl transition-all font-bold shadow-sm flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          </div>
        );
      }

      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-8 text-center bg-background text-foreground animate-in fade-in duration-500 overflow-y-auto">

          <div className="relative mb-10 group">
            <div className="absolute inset-0 bg-red-600/10 blur-[80px] rounded-full animate-pulse-slow"></div>
            <div className="p-10 bg-card rounded-[32px] border border-red-500/20 relative shadow-2xl ring-1 ring-red-500/10 transition-transform duration-700">
              <AlertTriangle className="w-20 h-20 text-red-600 drop-shadow-[0_0_15px_rgba(230,57,70,0.5)]" />
            </div>
          </div>

          <h1 className="text-5xl font-black font-cinema tracking-tighter mb-6 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent italic uppercase">
            Application Interrupted
          </h1>
          <p className="text-muted-foreground text-base max-w-lg leading-relaxed mb-10 font-medium">
            A runtime exception has suspended the studio environment to protect your data integrity.
          </p>

          {isDev && (
            <div className="w-full max-w-2xl mb-10">
              <div className="bg-secondary/40 rounded-2xl border border-border overflow-hidden text-left shadow-2xl backdrop-blur-xl">
                <div className="bg-secondary/60 px-5 py-4 border-b border-border flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    DEV MODE: Trace
                  </span>
                  <button
                    onClick={this.copyErrorToClipboard}
                    className="text-[11px] flex items-center gap-2 text-primary-foreground bg-primary hover:brightness-110 transition-all px-4 py-1.5 rounded-lg font-bold"
                  >
                    {this.state.copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {this.state.copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-6 bg-black/40">
                  <pre className="text-xs font-mono text-red-500/90 whitespace-pre-wrap break-words max-h-60 overflow-y-auto scrollbar-thin pr-2">
                    {this.state.error?.message || "Unknown Studio Error"}
                    {this.state.error?.stack && `\n\nSTACK TRACE:\n${this.state.error.stack}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full max-sm:max-w-sm">
            <button
              onClick={this.handleReload}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 font-black text-sm uppercase tracking-wider"
            >
              <RefreshCw className="w-5 h-5" />
              Re-Launch Studio
            </button>
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-2xl transition-all font-black text-sm uppercase tracking-wider"
            >
              <Home className="w-5 h-5" />
              Return Home
            </a>
          </div>

          <p className="mt-12 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            swarasutra-OS v1.0-STABLE
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}