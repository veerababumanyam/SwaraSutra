import React, { useState } from "react";
import { Key, Save, Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { saveApiKey, testApiKey } from "../utils";
import { GlassButton } from "./ui/GlassButton";
import { APP_NAME } from "../constants";

interface ApiKeyWelcomeModalProps {
    isOpen: boolean;
    onSuccess: () => void;
    onSkip: () => void;
}

export const ApiKeyWelcomeModal: React.FC<ApiKeyWelcomeModalProps> = ({ isOpen, onSuccess, onSkip }) => {
    const [apiKeyInput, setApiKeyInput] = useState("");
    const [isTesting, setIsTesting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSave = async () => {
        const trimmed = apiKeyInput.trim();
        if (!trimmed) {
            setErrorMsg("Please enter a valid API key.");
            return;
        }

        setIsTesting(true);
        setErrorMsg(null);

        try {
            const result = await testApiKey(trimmed);
            if (result.success) {
                saveApiKey(trimmed);
                onSuccess();
            } else {
                setErrorMsg(result.message);
            }
        } catch (e) {
            setErrorMsg("An unexpected error occurred. Please try again.");
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md relative glass-thick rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25 mb-4">
                        <Key className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground">
                        Welcome to {APP_NAME}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        To start generating lyrics and music, please connect your Gemini API key. This is stored locally on your device.
                    </p>
                </div>

                {/* Input Section */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                            Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={apiKeyInput}
                            onChange={(e) => {
                                setApiKeyInput(e.target.value);
                                if (errorMsg) setErrorMsg(null);
                            }}
                            placeholder="AIza..."
                            className="w-full glass-bordered px-4 py-3 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                            autoFocus
                        />
                    </div>

                    {/* Messages */}
                    {errorMsg && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium animate-in slide-in-from-top-1">
                            <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <GlassButton
                            onClick={handleSave}
                            disabled={isTesting || !apiKeyInput.trim()}
                            variant="primary"
                            size="lg"
                            className="w-full justify-center text-sm font-bold uppercase tracking-wide gap-2 shadow-lg shadow-primary/20"
                        >
                            {isTesting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> Connect Neural Link
                                </>
                            )}
                        </GlassButton>

                        <button
                            onClick={onSkip}
                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors py-2"
                        >
                            Skip for now (Explore Mode)
                        </button>
                    </div>
                </div>

                {/* Footer / Help */}
                <div className="pt-6 border-t border-white/10 text-center">
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 font-bold text-xs uppercase tracking-wide transition-all hover:scale-105"
                    >
                        Get Free Gemini API Key <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
};
