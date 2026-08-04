import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { auth, db } from "../lib/firebase_config";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";

export type UserRole = "booker" | "companion" | null;

// 0 / no field -> bukan admin
// 1 -> admin operasional
// 2 -> admin verifikasi
// 3 -> owner / super admin
export type AdminLevel = 0 | 1 | 2 | 3;

interface UserOnlineStatus {
    is_online: boolean;
    last_seen: any;
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: any | null;
    role: UserRole;
    adminLevel: AdminLevel;
    isAdmin: boolean;
    isOwner: boolean;
    isVerifikasiOrAbove: boolean;
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

function toAdminLevel(val: any): AdminLevel {
    const n = typeof val === "number" ? val : parseInt(val, 10);
    if (n === 1 || n === 2 || n === 3) return n;
    return 0;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [adminLevel, setAdminLevel] = useState<AdminLevel>(0);
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
    // Admin sekarang adalah companion dengan field admin_level >= 1 pada
    // document profile_companion. Tidak ada lagi document profile_admin,
    // dan tidak ada lagi role "admin" pada user_details.
    useEffect(() => {
        let unsubscribeDetails: (() => void) | null = null;
        let unsubscribeProfile: (() => void) | null = null;

        const denyAccess = async () => {
            setRole(null);
            setAdminLevel(0);
            setUserProfile(null);
            setLoading(false);
            await auth.signOut();
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                const userDetailsRef = doc(db, "user_details", user.uid);
                unsubscribeDetails = onSnapshot(userDetailsRef, async (detailsSnap) => {
                    if (!detailsSnap.exists()) {
                        await denyAccess();
                        return;
                    }

                    const detailsData = detailsSnap.data();
                    // Hanya akun companion yang bisa punya admin_level.
                    if (detailsData.role !== "companion") {
                        await denyAccess();
                        return;
                    }

                    const profileRef = doc(db, "profile_companion", user.uid);
                    unsubscribeProfile = onSnapshot(profileRef, async (profileSnap) => {
                        if (!profileSnap.exists()) {
                            await denyAccess();
                            return;
                        }

                        const profileData = profileSnap.data();
                        const level = toAdminLevel(profileData?.admin_level);

                        if (level === 0) {
                            // Companion valid, tapi bukan admin -> tidak punya akses admin panel.
                            await denyAccess();
                            return;
                        }

                        setRole("companion");
                        setAdminLevel(level);
                        setUserProfile(profileData);
                        setLoading(false);
                    });
                });
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                setRole(null);
                setAdminLevel(0);
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

    const isAdmin = adminLevel > 0;
    const isOwner = adminLevel === 3;
    // Level 2 (verifikasi) dan level 3 (owner) — dipakai untuk fitur
    // Customer Service & Laporan yang tidak boleh diakses admin_level 1.
    const isVerifikasiOrAbove = adminLevel >= 2;

    return (
        <AuthContext.Provider value={{ currentUser, userProfile, role, adminLevel, isAdmin, isOwner, isVerifikasiOrAbove, loading, isOnline, watchUser, getUserStatus, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
