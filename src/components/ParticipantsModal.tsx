"use client";
import type { RoomState } from "@/types/game";
import { useState, useEffect } from "react";

export default function ParticipantsModal({
  open,
  onClose,
  room,
  onRename,
}: {
  open: boolean;
  onClose: () => void;
  room: RoomState;
  onRename: (id: string, name: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  useEffect(() => {
    if (open) {
      const d: Record<string, string> = {};
      room.players.forEach((p) => (d[p.id] = p.name));
      setDrafts(d);
    }
  }, [open, room.players]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between">
          <div className="text-accent text-xs uppercase tracking-widest">Edit Participants</div>
          <button onClick={onClose} className="text-parchment/50 hover:text-parchment">×</button>
        </div>
        <ul className="mt-4 space-y-2 max-h-80 overflow-auto">
          {room.players.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <input
                value={drafts[p.id] ?? ""}
                onChange={(e) => setDrafts({ ...drafts, [p.id]: e.target.value })}
                className="flex-1 bg-parchment/10 rounded px-3 py-2 text-parchment outline-none border border-parchment/15"
              />
              <button
                onClick={() => onRename(p.id, drafts[p.id] || p.name)}
                className="btn-pill"
              >
                Save
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="btn-pill">Close</button>
        </div>
      </div>
    </div>
  );
}
