// contexts/OnlineStatusContext.tsx
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase_config";
import { AuthContext } from "@/context/AuthContext"; // sesuaikan path
import React from "react";

interface UserOnlineStatus {
  is_online: boolean;
  last_seen: any;
}

interface OnlineStatusContextType {
  isOnline: boolean;
  watchUser: (userId: string) => void;
  getUserStatus: (userId: string) => UserOnlineStatus | null;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export const OnlineStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const userId = auth?.currentUser?.uid ?? null;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [watchedStatuses, setWatchedStatuses] = useState<Record<string, UserOnlineStatus>>({});
  const watchedUnsubs = useRef<Record<string, () => void>>({});

  const updateStatus = async (online: boolean) => {
    if (!userId) return;
    const ref = doc(db, "online_status", userId);
    await setDoc(ref, {
      is_online: online,
      last_seen: serverTimestamp(),
    }, { merge: true });
  };

  // Sync online/offline browser events
  useEffect(() => {
    if (!userId) return;

    const handleOnline = () => { setIsOnline(true); updateStatus(true); };
    const handleOffline = () => { setIsOnline(false); updateStatus(false); };
    const handleUnload = () => updateStatus(false);
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") updateStatus(false);
      else updateStatus(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibility);

    // Set online saat pertama login
    updateStatus(true);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
      updateStatus(false);
    };
  }, [userId]);

  // Watch realtime status user lain
  const watchUser = (targetUserId: string) => {
    if (watchedUnsubs.current[targetUserId]) return; // sudah di-watch

    const ref = doc(db, "online_status", targetUserId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setWatchedStatuses((prev) => ({
          ...prev,
          [targetUserId]: snap.data() as UserOnlineStatus,
        }));
      }
    });

    watchedUnsubs.current[targetUserId] = unsub;
  };

  // Cleanup semua watcher saat unmount
  useEffect(() => {
    return () => {
      Object.values(watchedUnsubs.current).forEach((unsub) => unsub());
    };
  }, []);

  const getUserStatus = (userId: string): UserOnlineStatus | null => {
    return watchedStatuses[userId] ?? null;
  };

  return (
    <OnlineStatusContext.Provider value={{ isOnline, watchUser, getUserStatus }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const ctx = useContext(OnlineStatusContext);
  if (!ctx) throw new Error("useOnlineStatus must be used inside OnlineStatusProvider");
  return ctx;
};