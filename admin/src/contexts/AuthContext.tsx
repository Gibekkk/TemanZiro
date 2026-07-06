import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { auth, db } from "../lib/firebase_config";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";

export type UserRole = "booker" | "companion" | "admin" | null;

interface UserOnlineStatus {
    is_online: boolean;
    last_seen: any;
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: any | null;
    role: UserRole;
    isAdmin: boolean;
    loading: boolean;
    isOnline: boolean;
    watchUser: (userId: string) => void;
    getUserStatus: (userId: string) => UserOnlineStatus | null;
    logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator ? navigator.onLine : true);
    const [watchedStatuses, setWatchedStatuses] = useState<Record<string, UserOnlineStatus>>({});
    const watchedUnsubs = useRef<Record<string, () => void>>({});

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const updateFirestore = async (uid: string, online: boolean) => {
        const docRef = doc(db, "online_status", uid);
        await setDoc(docRef, { is_online: online, last_seen: serverTimestamp() }, { merge: true });
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

    // ─── Auth Logic ───────────────────────────────────────────────────────────
    useEffect(() => {
        let unsubscribeDetails: (() => void) | null = null;
        let unsubscribeProfile: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                const userDetailsRef = doc(db, "user_details", user.uid);
                unsubscribeDetails = onSnapshot(userDetailsRef, async (detailsSnap) => {
                    if (detailsSnap.exists()) {
                        const detailsData = detailsSnap.data();
                        const selectedRole: UserRole = detailsData.role === "admin"
                            ? "admin"
                            : detailsData.role === "companion"
                                ? "companion"
                                : "booker";

                        if (selectedRole !== "admin") {
                            setRole(null);
                            setIsAdmin(false);
                            setUserProfile(null);
                            setLoading(false);
                            await auth.signOut();
                            return;
                        }

                        setRole("admin");
                        setIsAdmin(true);

                        const profileRef = doc(db, "profile_admin", user.uid);
                        unsubscribeProfile = onSnapshot(profileRef, async (profileSnap) => {
                            if (profileSnap.exists() && profileSnap.data()?.name) {
                                setUserProfile(profileSnap.data());
                            } else {
                                // Fallback: create profile_admin if not exists
                                const fallbackProfile = { name: user.displayName || user.email || 'Admin' };
                                await setDoc(profileRef, fallbackProfile);
                                setUserProfile(fallbackProfile);
                            }
                            setLoading(false);
                        });
                    } else {
                        setRole(null);
                        setIsAdmin(false);
                        setUserProfile(null);
                        setLoading(false);
                        await auth.signOut();
                    }
                });
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                setRole(null);
                setIsAdmin(false);
                setLoading(false);
                if (unsubscribeDetails) unsubscribeDetails();
                if (unsubscribeProfile) unsubscribeProfile();
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDetails) unsubscribeDetails();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    const logOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, userProfile, role, isAdmin, loading, isOnline, watchUser, getUserStatus, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
