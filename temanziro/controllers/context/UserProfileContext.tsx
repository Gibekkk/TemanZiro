import React, { createContext, useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { UserRepository } from "@/data/repositories/UserRepository";
import { UserProfile } from "@/domain/models/UserModels";
import { UserRole } from "@/constants/UserDetails";
import { auth } from "@/data/config/firebase_config";

interface UserProfileContextType {
    userProfile: UserProfile | null;
    role: UserRole;
    userBalance: string;
    isVerified: boolean;
    isComplete: boolean;
    profileLoading: boolean;
}

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useContext(AuthContext);

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<UserRole>("booker");
    const [userBalance, setUserBalance] = useState<string>("0");
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [profileLoading, setProfileLoading] = useState(true);

    const unsubProfileRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        setProfileLoading(true);

        const unsubDetails = UserRepository.subscribeUserDetails(currentUser.uid, async (detailsData) => {
            if (!detailsData) {
                setProfileLoading(false);
                return;
            }

            if (detailsData.role === "admin") {
                await auth.signOut();
                return;
            }

            const currentRole: UserRole = detailsData.role === "companion" ? "companion" : "booker";
            setRole(currentRole);
            setIsVerified(detailsData.is_verified);
            setIsComplete(detailsData.is_complete ?? false);

            unsubProfileRef.current?.();
            unsubProfileRef.current = UserRepository.subscribeUserProfile(currentUser.uid, (profileData) => {
                setUserProfile(profileData);
                setUserBalance(profileData?.balance_user ?? "0");
                setProfileLoading(false);
            });
        });

        return () => {
            unsubDetails();
            unsubProfileRef.current?.();
        };
    }, [currentUser]);

    return (
        <UserProfileContext.Provider value={{ userProfile, userBalance, role, isVerified, isComplete, profileLoading }}>
            {children}
        </UserProfileContext.Provider>
    );
}