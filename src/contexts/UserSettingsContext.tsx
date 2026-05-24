"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { RoomState } from "@/types/game";
import {
  buildHistoryEntry,
  defaultUserSettings,
  readUserSettings,
  sanitizeDisplayName,
  type NotificationEntry,
  type NotificationSettings,
  type UserSettings,
  writeUserSettings,
} from "@/lib/userSettings";

type UserSettingsContextValue = {
  settings: UserSettings;
  setDisplayName: (value: string) => void;
  updateNotifications: (value: Partial<NotificationSettings>) => void;
  pushInboxNotification: (entry: Omit<NotificationEntry, "id" | "createdAt" | "read">) => void;
  markInboxRead: () => void;
  recordCompletedGame: (room: RoomState, playerId: string) => void;
};

const UserSettingsContext = createContext<UserSettingsContextValue>({
  settings: defaultUserSettings,
  setDisplayName: () => {},
  updateNotifications: () => {},
  pushInboxNotification: () => {},
  markInboxRead: () => {},
  recordCompletedGame: () => {},
});

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);

  useEffect(() => {
    setSettings(readUserSettings());
  }, []);

  function commit(update: UserSettings | ((current: UserSettings) => UserSettings)) {
    setSettings((current) => {
      const next = typeof update === "function" ? update(current) : update;
      writeUserSettings(next);
      return next;
    });
  }

  function setDisplayName(value: string) {
    commit((current) => ({ ...current, displayName: sanitizeDisplayName(value) }));
  }

  function updateNotifications(value: Partial<NotificationSettings>) {
    commit((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        ...value,
      },
    }));
  }

  function pushInboxNotification(entry: Omit<NotificationEntry, "id" | "createdAt" | "read">) {
    commit((current) => ({
      ...current,
      inbox: [
        {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: Date.now(),
          read: false,
        },
        ...current.inbox,
      ].slice(0, 100),
    }));
  }

  function markInboxRead() {
    commit((current) => ({
      ...current,
      inbox: current.inbox.map((item) => ({ ...item, read: true })),
    }));
  }

  function recordCompletedGame(room: RoomState, playerId: string) {
    const entry = buildHistoryEntry(room, playerId);
    if (!entry) return;
    commit((current) => {
      if (current.history.some((item) => item.id === entry.id)) return current;
      return {
        ...current,
        history: [entry, ...current.history].slice(0, 50),
      };
    });
  }

  return (
    <UserSettingsContext.Provider
      value={{ settings, setDisplayName, updateNotifications, pushInboxNotification, markInboxRead, recordCompletedGame }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  return useContext(UserSettingsContext);
}
