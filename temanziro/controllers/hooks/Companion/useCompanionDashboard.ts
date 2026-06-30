import { useState, useEffect } from "react";
import { useAuth } from "../useAuth";
import { usePresence } from "../usePresence";
import { useUserProfile } from "../useUserProfile";
import { useTheme } from "../useTheme";
import { CompanionRepository } from "@/data/repositories/CompanionRepository";
import { CompanionProfile } from "@/domain/models/CompanionModel";
import { calculateTierProgress } from "@/data/repositories/utils/TierUtils";
import { BADGES } from "@/constants/TierDetails";
import { FriendItem } from "@/views/components/FriendList/FriendList";
import {
    USE_DUMMY_DATA,
    DUMMY_COMPANION_PROFILE,
    DUMMY_BOOKING_COUNT,
    DUMMY_FRIENDS,
    DUMMY_SCHEDULE
} from "@/constants/Config";

export function useCompanionDashboard() {
    const { currentUser } = useAuth();
    const presence = usePresence();
    const { userProfile, profileLoading: contextProfileLoading } = useUserProfile();
    const { theme } = useTheme();

    const profileLoading = USE_DUMMY_DATA ? false : contextProfileLoading;

    const companionProfile = USE_DUMMY_DATA
        ? DUMMY_COMPANION_PROFILE
        : (userProfile as CompanionProfile | null);
    const [bookingCount, setBookingCount] = useState<number | null>(null);
    const [loadingBadge, setLoadingBadge] = useState<boolean>(true);
    const [localIsActive, setLocalIsActive] = useState<boolean>(DUMMY_COMPANION_PROFILE.is_active_companion);

    // Fetch Booking Count for Badge/Tier
    useEffect(() => {
        let isMounted = true;

        async function fetchBookingCount() {
            if (USE_DUMMY_DATA) {
                if (isMounted) {
                    setBookingCount(DUMMY_BOOKING_COUNT);
                    setLoadingBadge(false);
                }
                return;
            }

            if (currentUser?.uid) {
                try {
                    setLoadingBadge(true);
                    const countData = await CompanionRepository.getCompanionBookingCount(currentUser.uid);
                    if (isMounted) {
                        setBookingCount(countData?.booking_count ?? 0);
                    }
                } catch (error) {
                    console.error("Error fetching companion booking count in hook:", error);
                } finally {
                    if (isMounted) {
                        setLoadingBadge(false);
                    }
                }
            } else {
                if (isMounted) {
                    setBookingCount(0);
                    setLoadingBadge(false);
                }
            }
        }

        fetchBookingCount();

        return () => {
            isMounted = false;
        };
    }, [currentUser]);

    // Sync local active state if profile loads in non-dummy mode
    useEffect(() => {
        if (!USE_DUMMY_DATA && companionProfile) {
            setLocalIsActive(companionProfile.is_active_companion);
        }
    }, [companionProfile]);

    // Derive Active Badge & Tier Progress (Model calculations)
    const { tier } = calculateTierProgress(bookingCount ?? 0);
    const activeBadge = BADGES.find((b) => b.id.toLowerCase() === tier.toLowerCase()) || BADGES[0];
    const Mascot = activeBadge.mascotMedal;

    // Derive Income Amount
    // If balance_companion exists in profile, parse it to number, otherwise default to 750000 dummy
    const incomeAmount = companionProfile?.balance_companion
        ? Number(companionProfile.balance_companion)
        : 750000;

    //  Active Status toggling (updates database in CompanionRepository)
    const isActive = USE_DUMMY_DATA ? localIsActive : (companionProfile?.is_active_companion ?? true);

    const handleToggleActive = async (nextState: boolean) => {
        if (USE_DUMMY_DATA) {
            setLocalIsActive(nextState);
            return;
        }
        if (!currentUser?.uid) return;
        try {
            await CompanionRepository.updateCompanionProfile(currentUser.uid, {
                is_active_companion: nextState,
            });
            setLocalIsActive(nextState);
        } catch (error) {
            console.error("Error updating companion active status:", error);
        }
    };

    // Dummy or real data based on configuration
    const friends: FriendItem[] = USE_DUMMY_DATA ? DUMMY_FRIENDS : [];
    const schedule = USE_DUMMY_DATA ? DUMMY_SCHEDULE : null;

    const handleRewardsPress = () => {
        console.log("Rewards button pressed");
    };

    const handleSchedulePress = () => {
        console.log("Schedule card pressed for:", schedule?.name);
    };

    return {
        currentUser,
        presence,
        userProfile,
        theme,
        companionProfile,
        profileLoading,
        bookingCount,
        loadingBadge,
        incomeAmount,
        isActive,
        handleToggleActive,
        tier,
        activeBadge,
        Mascot,
        friends,
        schedule,
        handleRewardsPress,
        handleSchedulePress,
    };
}
