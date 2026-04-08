"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SCANNER_ID = "mc-qr-scanner";

export default function QRScanner({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    let stopped = false;

    // html5-qrcode is browser-only — dynamic import so Next doesn't SSR it.
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (stopped) return;

      const scanner = new Html5Qrcode(SCANNER_ID, { verbose: false });
      scannerRef.current = scanner;
      setScanning(true);

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText: string) => {
            // Accept full URL (e.g. https://host/play/ABCD) or bare 4-letter code.
            let code: string | null = null;
            try {
              const url = new URL(decodedText);
              const m = url.pathname.match(/\/play\/([A-Z0-9]{3,8})/i);
              if (m) code = m[1].toUpperCase();
            } catch {
              // not a URL — try treating it as a bare room code
              if (/^[A-Z0-9]{3,8}$/i.test(decodedText.trim())) {
                code = decodedText.trim().toUpperCase();
              }
            }

            if (code) {
              scanner.stop().catch(() => {});
              onClose();
              router.push(`/play/${code}`);
            }
          },
          () => {} // ignore per-frame errors
        )
        .catch((err: any) => {
          setScanning(false);
          setError(
            err?.message?.includes("permission")
              ? "Camera permission denied. Please allow camera access and try again."
              : "Could not start camera. Make sure you are on HTTPS or localhost."
          );
        });
    });

    return () => {
      stopped = true;
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
      setScanning(false);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-ink/90 backdrop-blur flex flex-col items-center justify-center px-6"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-parchment/60 hover:text-parchment text-2xl leading-none"
            aria-label="Close scanner"
          >
            ×
          </button>

          <h2 className="text-xl text-accent font-display mb-6">Scan Room QR Code</h2>

          {/* Camera viewport */}
          <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-2 border-accent/40 shadow-glow bg-ink">
            {/* The library injects a <video> into this div */}
            <div id={SCANNER_ID} className="w-full h-full" />

            {/* Finder overlay */}
            {scanning && !error && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-44 h-44 border-2 border-accent rounded-xl opacity-70">
                  <span className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 border-accent rounded-tl" />
                  <span className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 border-accent rounded-tr" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 border-accent rounded-bl" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 border-accent rounded-br" />
                  {/* Scanning line animation */}
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-accent/70"
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            {!scanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center text-parchment/40 text-sm">
                Starting camera…
              </div>
            )}
          </div>

          {error ? (
            <p className="mt-6 text-crimson text-sm text-center max-w-xs">{error}</p>
          ) : (
            <p className="mt-6 text-parchment/60 text-sm text-center">
              Point at the QR code on the host screen
            </p>
          )}

          {/* Manual code entry fallback */}
          <ManualEntry onJoin={(code) => { onClose(); router.push(`/play/${code}`); }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ManualEntry({ onJoin }: { onJoin: (code: string) => void }) {
  const [code, setCode] = useState("");
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-parchment/40 text-xs uppercase tracking-widest">Or enter room code</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="ABCD"
          className="w-28 bg-parchment/10 border border-parchment/20 rounded px-3 py-2 text-parchment text-center tracking-[0.3em] outline-none uppercase text-lg"
          maxLength={6}
        />
        <button
          disabled={code.length < 3}
          onClick={() => onJoin(code)}
          className="btn-primary !py-2 !px-4 disabled:opacity-40"
        >
          Join
        </button>
      </div>
    </div>
  );
}
