import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useEffect, useState, useRef, ReactNode } from "react";
import { auth, db, rtdb } from "@/config/firebase_config";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, set, onDisconnect } from "firebase/database";

export type UserRole = "booker" | "companion" | null;

interface UserOnlineStatus {
    is_online: boolean;
    last_seen: any;
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: any | null;
    role: UserRole;
    loading: boolean;
    isOnline: boolean;
    userBalance: string;
    isVerified: boolean;
    isComplete: boolean;
    watchUser: (userId: string) => void;
    getUserStatus: (userId: string) => UserOnlineStatus | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);
    const [userBalance, setUserBalance] = useState<string>("0");
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [watchedStatuses, setWatchedStatuses] = useState<Record<string, UserOnlineStatus>>({});
    const watchedUnsubs = useRef<Record<string, () => void>>({});

    // ─── Helpers ──────────────────────────────────────────────────────────────
    const updateFirestore = async (uid: string, online: boolean) => {
        const statusRef = doc(db, "online_status", uid);
        await setDoc(statusRef, { is_online: online, last_seen: serverTimestamp() }, { merge: true });
    };

    const watchUser = (targetUserId: string) => {
        if (watchedUnsubs.current[targetUserId]) return;
        const statusRef = doc(db, "online_status", targetUserId);
        const unsub = onSnapshot(statusRef, (snap) => {
            if (snap.exists()) {
                setWatchedStatuses((prev) => ({ ...prev, [targetUserId]: snap.data() as UserOnlineStatus }));
            }
        });
        watchedUnsubs.current[targetUserId] = unsub;
    };

    const getUserStatus = (userId: string): UserOnlineStatus | null => {
        return watchedStatuses[userId] ?? null;
    };

    // ─── Presence (RTDB + Firestore) — hanya aktif saat login ────────────────
    useEffect(() => {
        if (!currentUser) return;

        const uid = currentUser.uid;
        const rtdbRef = ref(rtdb, `online_status/${uid}`);

        const setupPresence = async () => {
            await onDisconnect(rtdbRef).set({ is_online: false });
            await set(rtdbRef, { is_online: true });
            await updateFirestore(uid, true);
            setIsOnline(true);
        };

        const handleOnline = async () => {
            setIsOnline(true);
            await set(rtdbRef, { is_online: true });
            await updateFirestore(uid, true);
        };

        const handleOffline = async () => {
            setIsOnline(false);
            await updateFirestore(uid, false);
        };

        const handleVisibility = async () => {
            if (document.visibilityState === "hidden") {
                await updateFirestore(uid, false);
            } else {
                await set(rtdbRef, { is_online: true });
                await updateFirestore(uid, true);
            }
        };

        setupPresence();

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            updateFirestore(uid, false);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            document.removeEventListener("visibilitychange", handleVisibility);
            Object.values(watchedUnsubs.current).forEach((unsub) => unsub());
            watchedUnsubs.current = {};
        };
    }, [currentUser]);

    // ─── Auth Logic ───────────────────────────────────────────────────────────
    useEffect(() => {
        const unsubProfile = { current: null as (() => void) | null };
        let unsubDetails: (() => void) | null = null;

        const unsubAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            if (user) {
                const userDetailsRef = doc(db, "user_details", user.uid);

                unsubDetails = onSnapshot(userDetailsRef, async (detailsSnap) => {
                    if (detailsSnap.exists()) {
                        const detailsData = detailsSnap.data();

                        if (detailsData.role === "admin") {
                            setRole(null);
                            setUserProfile(null);
                            setUserBalance("0");
                            setLoading(false);
                            setIsVerified(false);
                            await auth.signOut();
                            return;
                        }

                        const selectedRole: UserRole =
                            detailsData.role === "companion" ? "companion" : "booker";

                        setRole(selectedRole);

                        if (unsubProfile.current) {
                            unsubProfile.current();
                            unsubProfile.current = null;
                        }

                        const profileRef =
                            selectedRole === "companion"
                                ? doc(db, "profile_companion", user.uid)
                                : doc(db, "profile_user", user.uid);

                        unsubProfile.current = onSnapshot(profileRef, (profileSnap) => {
                            const profileData = profileSnap.exists() ? profileSnap.data() : null;
                            setUserProfile(profileData);
                            setUserBalance(profileData?.balance_user ?? "0");
                            setLoading(false);
                            setIsVerified(detailsData.is_verified);
                            setIsComplete(detailsData.is_complete ?? false);
                        });
                    } else {
                        setRole(null);
                        setUserBalance("0");
                        setUserProfile(null);
                        setIsVerified(false);
                        setIsComplete(false);
                        setLoading(false);
                    }
                });
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                setRole(null);
                setIsVerified(false);
                setIsComplete(false);
                setUserBalance("0");
                setLoading(false);

                if (unsubProfile.current) {
                    unsubProfile.current();
                    unsubProfile.current = null;
                }
                if (unsubDetails) {
                    unsubDetails();
                    unsubDetails = null;
                }
            }
        });

        return () => {
            unsubAuth();
            if (unsubProfile.current) unsubProfile.current();
            if (unsubDetails) unsubDetails();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{ currentUser, userProfile, role, loading, isOnline, userBalance, watchUser, getUserStatus, isVerified, isComplete }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};