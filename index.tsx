
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Studio from "./components/Studio";
import { AboutPage } from "./components/AboutPage";
import { ArchitectProfile } from "./components/ArchitectProfile";

import { StudioProvider } from "./contexts/StudioContext";
import "./global.css";

/**
 * LayaVani - Entry Point
 * Orchestrates the primary React mount.
 */

const App = () => {
  return (
    <BrowserRouter>
      <StudioProvider>
        <Routes>
          {/* Studio Dashboard (Default Route) */}
          <Route path="/" element={
            <ErrorBoundary scope="Root: Studio">
              <Studio />
            </ErrorBoundary>
          } />

          {/* About Page Route */}
          <Route path="/about" element={
            <ErrorBoundary scope="Root: About">
              <AboutPage />
            </ErrorBoundary>
          } />

          {/* Architect Profile Route */}
          <Route path="/architect" element={
            <ErrorBoundary scope="Root: Architect">
              <ArchitectProfile />
            </ErrorBoundary>
          } />



          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StudioProvider>
    </BrowserRouter>
  );
};

const startApp = () => {
  console.log("%c LayaVani AI %c Initializing Orchestrator... ", "background: #2563EB; color: white; font-weight: bold;", "color: #06B6D4;");

  const container = document.getElementById("root");
  if (!container) {
    console.error("LayaVani: Fatal Boot Error - DOM target '#root' not found.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("%c LayaVani AI %c Systems Online. ", "background: #2563EB; color: white; font-weight: bold;", "color: #4ade80;");
  } catch (error) {
    console.error("LayaVani: Initialization Failed:", error);
    // Security: Do not expose stack traces in the DOM in production
    const isDev = process.env.NODE_ENV === 'development';
    container.innerHTML = `
      <div style="color: #ff4444; padding: 40px; text-align: center; font-family: sans-serif; background: #020617; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #2563EB;">LayaVani OS Error</h1>
        <p style="color: #94A3B8;">Critical System Fault. The application could not be loaded securely.</p>
        ${isDev ? `<pre style="text-align: left; background: #0F172A; padding: 20px; border-radius: 12px; font-size: 12px; margin-top: 20px; border: 1px solid #1E293B;">${error instanceof Error ? error.stack : 'Unknown error'}</pre>` : ''}
        <button onclick="window.location.reload()" style="margin-top: 24px; padding: 12px 24px; background: #2563EB; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">System Reboot</button>
      </div>
    `;
  }
};

// Start the boot sequence
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('%c LayaVani PWA %c Service Worker registered ✓', 'background: #6d28d9; color: white; font-weight: bold;', 'color: #4ade80;');

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available — notify the user
                console.log('%c LayaVani PWA %c New version available! Refreshing...', 'background: #6d28d9; color: white; font-weight: bold;', 'color: #f59e0b;');
                newWorker.postMessage('SKIP_WAITING');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('LayaVani: Service Worker registration failed:', error);
      });
  });
}