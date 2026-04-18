"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/contexts/LanguageContext";

type InstallState =
  | "hidden"       // already installed, or not a PWA-capable browser
  | "prompt"       // Android/Chrome — native prompt available
  | "ios"          // iOS Safari — must guide user manually
  | "installed";   // user just installed

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
}

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as any).standalone === true)
  );
}

export default function InstallButton() {
  const { t } = useT();
  const [state, setState] = useState<InstallState>("hidden");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [iosOpen, setIosOpen] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return; // already running as installed app

    if (isIosSafari()) {
      setState("ios");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setState("prompt");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") setState("installed");
    else setState("hidden");
  }

  if (state === "hidden") return null;

  if (state === "installed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-accent/70 text-sm"
      >
        <span>{t.alreadyInstalled}</span>
      </motion.div>
    );
  }

  if (state === "ios") {
    return (
      <div className="relative">
        <button
          onClick={() => setIosOpen((v) => !v)}
          className="flex items-center gap-2 btn-ghost text-sm"
        >
          {/* Download icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v13M7 11l5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          {t.installApp}
        </button>

        <AnimatePresence>
          {iosOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-ink border border-parchment/20 rounded-xl p-4 shadow-2xl text-center"
            >
              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-ink border-r border-b border-parchment/20 rotate-45" />
              <div className="flex justify-center mb-2 text-accent">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <p className="text-parchment/90 text-sm font-medium">{t.installIosHint}</p>
              <p className="mt-1 text-parchment/45 text-xs">Safari only</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // state === "prompt"
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleInstall}
      className="flex items-center gap-2 btn-ghost text-sm"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v13M7 11l5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      {t.installApp}
    </motion.button>
  );
}
