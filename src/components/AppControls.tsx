"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDifficultyDisplay, getGenreDisplay, LOCALES, type Locale } from "@/lib/i18n";
import { useT } from "@/contexts/LanguageContext";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { type NotificationChannel } from "@/lib/userSettings";

type SettingsPanel = "menu" | "language" | "profile" | "notification";

export default function AppControls() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useT();
  const { settings, setDisplayName, updateNotifications, markInboxRead } = useUserSettings();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<SettingsPanel>("menu");
  const [nameDraft, setNameDraft] = useState(settings.displayName);
  const unreadCount = settings.inbox.filter((item) => !item.read).length;

  useEffect(() => {
    setNameDraft(settings.displayName);
  }, [settings.displayName]);

  useEffect(() => {
    setOpen(false);
    setPanel("menu");
  }, [pathname]);

  useEffect(() => {
    if (panel === "notification") markInboxRead();
  }, [markInboxRead, panel]);

  if (pathname === "/") {
    return (
      <>
        <div className="fixed top-5 right-5 z-[70]">
          <button
            onClick={() => setOpen(true)}
            className="btn-pill !py-2.5 !px-4 bg-ink/70 backdrop-blur border border-parchment/20 text-sm"
          >
            {LOCALES.find((item) => item.code === locale)?.label || t.language}
          </button>
        </div>
        {open && (
          <SimpleLanguageModal
            locale={locale}
            setLocale={setLocale}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="fixed top-5 left-0 right-0 z-[70] px-5 pointer-events-none">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="pointer-events-auto rounded-full border border-parchment/20 bg-ink/65 px-4 py-2 text-sm text-parchment/80 backdrop-blur hover:text-parchment"
          >
            {t.home}
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full border border-parchment/20 bg-ink/65 text-parchment/80 backdrop-blur hover:text-parchment"
            aria-label={t.settingsMenu}
          >
            <GearIcon />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-crimson px-1 text-[10px] text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/82 px-4 backdrop-blur">
          <div className="card w-full max-w-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="text-accent text-xs uppercase tracking-[0.35em]">{t.settingsMenu}</div>
              <button onClick={() => setOpen(false)} className="text-sm text-parchment/60 hover:text-parchment">
                {t.close}
              </button>
            </div>

            {panel === "menu" && (
              <div className="mt-5 grid gap-3">
                <button onClick={() => setPanel("language")} className="btn-pill !py-3 !px-4 text-left">
                  {t.language}
                </button>
                <button onClick={() => setPanel("profile")} className="btn-pill !py-3 !px-4 text-left">
                  {t.myProfile}
                </button>
                <button onClick={() => setPanel("notification")} className="btn-pill !py-3 !px-4 text-left">
                  {t.notifications} {unreadCount > 0 ? `(${unreadCount})` : ""}
                </button>
              </div>
            )}

            {panel === "language" && (
              <div className="mt-5">
                <button onClick={() => setPanel("menu")} className="text-sm text-parchment/60 hover:text-parchment">
                  {t.back}
                </button>
                <div className="mt-4 grid gap-2">
                  {LOCALES.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => setLocale(item.code)}
                      className={
                        "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition " +
                        (item.code === locale
                          ? "border-accent bg-accent/10 text-parchment"
                          : "border-parchment/10 bg-parchment/5 text-parchment/80 hover:border-accent/35")
                      }
                    >
                      <span>{item.label}</span>
                      <span>{item.flag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {panel === "profile" && (
              <div className="mt-5">
                <button onClick={() => setPanel("menu")} className="text-sm text-parchment/60 hover:text-parchment">
                  {t.back}
                </button>
                <div className="mt-4">
                  <div className="text-accent text-xs uppercase tracking-widest">{t.displayName}</div>
                  <input
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-parchment/15 bg-parchment/10 px-4 py-3 text-parchment outline-none"
                    placeholder={t.playerPlaceholder}
                  />
                  <button onClick={() => setDisplayName(nameDraft)} className="mt-3 btn-primary !py-2 !px-4">
                    {t.save}
                  </button>
                </div>

                <div className="mt-6">
                  <div className="text-accent text-xs uppercase tracking-widest">{t.gameHistory}</div>
                  <div className="mt-3 max-h-72 space-y-3 overflow-auto pr-1">
                    {settings.history.length === 0 ? (
                      <div className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4 text-sm text-parchment/60">
                        {t.noGamesRecorded}
                      </div>
                    ) : (
                      settings.history.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-parchment font-medium">{getGenreDisplay(item.genre, t).name}</div>
                            <div className={item.outcome === "won" ? "text-emerald-400 text-sm" : "text-parchment/60 text-sm"}>
                              {item.outcome === "won" ? t.won : t.lost}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-parchment/70">
                            {item.mode === "solo" ? t.solo : t.onlinePvp} · {getDifficultyDisplay(item.difficulty, t).label} · {t.scoreWord} {item.score}
                          </div>
                          <div className="mt-1 text-xs text-parchment/50">
                            {t.roomWord} {item.roomCode} · {new Date(item.playedAt).toLocaleString(locale)}
                          </div>
                          <div className="mt-2 text-xs text-parchment/60">
                            {t.participantsWord}: {item.participants.join(", ")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {panel === "notification" && (
              <div className="mt-5">
                <button onClick={() => setPanel("menu")} className="text-sm text-parchment/60 hover:text-parchment">
                  {t.back}
                </button>

                <div className="mt-4">
                  <div className="text-accent text-xs uppercase tracking-widest">{t.delivery}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {([
                      ["email", t.email],
                      ["sms", t.textMessage],
                      ["none", t.optOut],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => updateNotifications({ channel: value as NotificationChannel })}
                        className={
                          "rounded-full border px-4 py-2 text-sm transition " +
                          (settings.notifications.channel === value
                            ? "border-accent bg-accent text-ink"
                            : "border-parchment/15 bg-parchment/5 text-parchment/75 hover:border-accent/35")
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {settings.notifications.channel === "email" && (
                  <input
                    value={settings.notifications.email}
                    onChange={(e) => updateNotifications({ email: e.target.value })}
                    className="mt-4 w-full rounded-xl border border-parchment/15 bg-parchment/10 px-4 py-3 text-parchment outline-none"
                    placeholder={t.emailAddress}
                  />
                )}

                {settings.notifications.channel === "sms" && (
                  <input
                    value={settings.notifications.phone}
                    onChange={(e) => updateNotifications({ phone: e.target.value })}
                    className="mt-4 w-full rounded-xl border border-parchment/15 bg-parchment/10 px-4 py-3 text-parchment outline-none"
                    placeholder={t.phoneNumber}
                  />
                )}

                <div className="mt-5 space-y-2">
                  <NotificationToggle
                    label={t.pointsEarned}
                    checked={settings.notifications.points}
                    onChange={(checked) => updateNotifications({ points: checked })}
                  />
                  <NotificationToggle
                    label={t.messagesFromOtherPlayers}
                    checked={settings.notifications.messages}
                    onChange={(checked) => updateNotifications({ messages: checked })}
                  />
                  <NotificationToggle
                    label={t.badgeUnlocks}
                    checked={settings.notifications.badges}
                    onChange={(checked) => updateNotifications({ badges: checked })}
                  />
                  <NotificationToggle
                    label={t.rankingUpdates}
                    checked={settings.notifications.ranking}
                    onChange={(checked) => updateNotifications({ ranking: checked })}
                  />
                </div>

                <div className="mt-6">
                  <div className="text-accent text-xs uppercase tracking-widest">{t.recentAlerts}</div>
                  <p className="mt-2 text-xs text-parchment/50">
                    {t.alertDeliveryNotice}
                  </p>
                  <div className="mt-3 max-h-56 space-y-3 overflow-auto pr-1">
                    {settings.inbox.length === 0 ? (
                      <div className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4 text-sm text-parchment/60">
                        {t.noNotificationsYet}
                      </div>
                    ) : (
                      settings.inbox.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-medium text-parchment">{item.title}</div>
                            <div className="text-[11px] text-parchment/50">{new Date(item.createdAt).toLocaleString(locale)}</div>
                          </div>
                          <div className="mt-2 text-sm text-parchment/70">{item.body}</div>
                          {item.roomCode && <div className="mt-2 text-xs text-parchment/50">{t.roomWord} {item.roomCode}</div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SimpleLanguageModal({
  locale,
  setLocale,
  onClose,
}: {
  locale: Locale;
  setLocale: (value: Locale) => void;
  onClose: () => void;
}) {
  const { t } = useT();
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/82 px-4 backdrop-blur">
      <div className="card w-full max-w-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="text-accent text-xs uppercase tracking-[0.35em]">{t.language}</div>
          <button onClick={onClose} className="text-sm text-parchment/60 hover:text-parchment">
            {t.close}
          </button>
        </div>
        <div className="mt-5 grid gap-2">
          {LOCALES.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setLocale(item.code);
                onClose();
              }}
              className={
                "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition " +
                (item.code === locale
                  ? "border-accent bg-accent/10 text-parchment"
                  : "border-parchment/10 bg-parchment/5 text-parchment/80 hover:border-accent/35")
              }
            >
              <span>{item.label}</span>
              <span>{item.flag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-3 text-sm text-parchment/80">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.7 1.7 0 0 0-1.82-.33 1.7 1.7 0 0 0-1 1.54V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1-1.54 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.54-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.7 1.7 0 0 0 8.95 4.6h.09A1.7 1.7 0 0 0 10 3.06V3a2 2 0 0 1 4 0v.09A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.09A1.7 1.7 0 0 0 20.94 10H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
    </svg>
  );
}
