import React, { useEffect, useState } from "react";
import { useAuth } from "@/controllers/hooks/useAuth";
import { usePresence } from "@/controllers/hooks/usePresence";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { useTheme } from "@/controllers/hooks/useTheme";
import { CompanionProfile } from "@/domain/models/CompanionModel";
import { useRouter } from "expo-router";
import { GENDER_DETAILS, Gender } from "@/constants/UserDetails";
import {
    USE_DUMMY_DATA,
    DUMMY_COMPANION_PROFILE,
    DUMMY_COMPANION_RATING,
    DUMMY_REVIEWS
} from "@/constants/Config";

export function useCompanionProfile() {
    const { currentUser, logout } = useAuth();
    const presence = usePresence();
    const { userProfile, profileLoading: contextProfileLoading, isComplete, isVerified } = useUserProfile();
    const { theme } = useTheme();
    const router = useRouter();

    const [companionProfile, setCompanionProfile] = useState<CompanionProfile | null>(null);
    const [localLoading, setLocalLoading] = useState<boolean>(USE_DUMMY_DATA);

    useEffect(() => {
        if (USE_DUMMY_DATA) {
            setLocalLoading(true);
            const timer = setTimeout(() => {
                setCompanionProfile(DUMMY_COMPANION_PROFILE);
                setLocalLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCompanionProfile(null);
            setLocalLoading(false);
        }
    }, [currentUser]);

    const profileLoading = USE_DUMMY_DATA ? localLoading : contextProfileLoading;
    const finalCompanionProfile = USE_DUMMY_DATA ? companionProfile : (userProfile as CompanionProfile | null);

    const reviews = USE_DUMMY_DATA ? DUMMY_REVIEWS : [];
    const rating = USE_DUMMY_DATA ? DUMMY_COMPANION_RATING : null;

    // Gender Helper Logic
    const getGenderIcon = (gender: string | undefined) => {
        const lowerGender = (gender?.toLowerCase() || "rahasia") as Gender;
        const details = GENDER_DETAILS[lowerGender] || GENDER_DETAILS.rahasia;
        return React.createElement(details.icon, { width: 22, height: 22 });
    };

    const getGenderLabel = (gender: string | undefined) => {
        const lowerGender = (gender?.toLowerCase() || "rahasia") as Gender;
        const details = GENDER_DETAILS[lowerGender] || GENDER_DETAILS.rahasia;
        return details.label;
    };

    // Navigation Handlers
    const handleKycRedirect = () => {
        router.push("/verification/VerificationDataCompanionScreen_Call");
    };

    const handleEditProfile = () => {
        console.log("Edit Profile Pressed");
        router.push("/companion/editprofilecompanion");
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/auth/AuthScreen_Call" as any);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Rating Distribution Calculations
    const ratingDistribution = [
        { star: 5, count: rating?.count_rating["5"] || 0 },
        { star: 4, count: rating?.count_rating["4"] || 0 },
        { star: 3, count: rating?.count_rating["3"] || 0 },
        { star: 2, count: rating?.count_rating["2"] || 0 },
        { star: 1, count: rating?.count_rating["1"] || 0 },
    ];
    const totalReviews = ratingDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;

    return {
        currentUser,
        presence,
        userProfile,
        theme,
        companionProfile: finalCompanionProfile,
        profileLoading,
        reviews,
        rating,
        isComplete,
        isVerified,
        getGenderIcon,
        getGenderLabel,
        handleKycRedirect,
        handleEditProfile,
        handleLogout,
        ratingDistribution,
        totalReviews,
    };
}