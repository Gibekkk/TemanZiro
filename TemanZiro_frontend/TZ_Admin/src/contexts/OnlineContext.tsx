import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase_config";
import { AuthContext } from "./AuthContext";

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

  const [isOnline, setIsOnline] = useState(navigator ? navigator.onLine : true);
  const [watchedStatuses, setWatchedStatuses] = useState<Record<string, UserOnlineStatus>>({});
  const watchedUnsubs = useRef<Record<string, () => void>>({});

  const updateStatus = async (online: boolean) => {
    if (!userId) return;
    const statusRef = doc(db, "online_status", userId);
    await setDoc(
      statusRef,
      {
        is_online: online,
        last_seen: serverTimestamp(),
      },
      { merge: true }
    );
  };

  useEffect(() => {
    if (!userId) return;

    const handleOnline = () => {
      setIsOnline(true);
      updateStatus(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateStatus(false);
    };

    const handleUnload = () => updateStatus(false);

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        updateStatus(false);
      } else {
        updateStatus(true);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibility);

    updateStatus(true);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
      updateStatus(false);
    };
  }, [userId]);

  const watchUser = (targetUserId: string) => {
    if (watchedUnsubs.current[targetUserId]) return;

    const targetRef = doc(db, "online_status", targetUserId);
    const unsub = onSnapshot(targetRef, (snap) => {
      if (snap.exists()) {
        setWatchedStatuses((prev) => ({
          ...prev,
          [targetUserId]: snap.data() as UserOnlineStatus,
        }));
      }
    });

    watchedUnsubs.current[targetUserId] = unsub;
  };

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
  const context = useContext(OnlineStatusContext);
  if (!context) {
    throw new Error("useOnlineStatus must be used within OnlineStatusProvider");
  }
  return context;
};
