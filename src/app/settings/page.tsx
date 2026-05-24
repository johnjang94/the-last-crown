"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useT } from "@/contexts/LanguageContext";

type SettingsInfo = Record<string, { set: boolean; preview: string }>;

export default function SettingsPage() {
  const { t } = useT();
  const [info, setInfo] = useState<SettingsInfo>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const fields = [
    { key: "OPENAI_API_KEY", label: "Round Content Key", secret: true },
    { key: "OPENAI_TEXT_MODEL", label: "Round Text Model", placeholder: "text-model-name" },
    { key: "OPENAI_IMAGE_MODEL", label: "Visual Model", placeholder: "image-model-name" },
    { key: "OPENAI_TTS_MODEL", label: "Narration Model", placeholder: "voice-model-name" },
    { key: "OPENAI_TTS_VOICE", label: "Narration Voice", placeholder: "voice-name" },
  ];

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setInfo);
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 py-16 max-w-2xl mx-auto"
    >
      <Link href="/" className="text-parchment/60 hover:text-parchment text-sm">{t.home}</Link>
      <h1 className="mt-6 text-3xl text-accent font-display">{t.settingsPageTitle}</h1>
      <p className="mt-2 text-parchment/60 text-sm">
        {t.settingsPageDesc}
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const body: Record<string, string> = {};
          for (const k of Object.keys(drafts)) if (drafts[k]) body[k] = drafts[k];
          await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const fresh = await fetch("/api/settings").then((r) => r.json());
          setInfo(fresh);
          setDrafts({});
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }}
      >
        {fields.map((f) => (
          <div key={f.key} className="card">
            <label className="text-accent text-xs uppercase tracking-widest">{f.label}</label>
            <div className="text-parchment/40 text-xs mt-1">
              {info[f.key]?.set ? t.currentValue(info[f.key].preview) : t.notSet}
            </div>
            <input
              type={f.secret ? "password" : "text"}
              value={drafts[f.key] ?? ""}
              onChange={(e) => setDrafts({ ...drafts, [f.key]: e.target.value })}
              placeholder={(f as any).placeholder || ""}
              className="mt-2 w-full bg-parchment/10 rounded px-3 py-2 text-parchment outline-none border border-parchment/15"
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary !py-2 !px-5">{t.save}</button>
          {saved && <span className="text-emerald-400 text-sm">{t.savedShort}</span>}
        </div>
      </form>
    </motion.main>
  );
}
