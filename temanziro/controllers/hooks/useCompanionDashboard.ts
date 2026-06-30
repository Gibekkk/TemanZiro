import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { usePresence } from "./usePresence";
import { useUserProfile } from "./useUserProfile";
import { useTheme } from "./useTheme";
import { CompanionRepository } from "@/data/repositories/CompanionRepository";
import { CompanionProfile } from "@/domain/models/CompanionModel";
import { calculateTierProgress } from "@/data/repositories/utils/TierUtils";
import { BADGES } from "@/constants/TierDetails";
import { FriendItem } from "@/views/components/FriendList/FriendList";

export function useCompanionDashboard() {
    const { currentUser } = useAuth();
    const presence = usePresence();
    const userProfileContext = useUserProfile();
    const { theme } = useTheme();

    const [companionProfile, setCompanionProfile] = useState<CompanionProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);
    const [bookingCount, setBookingCount] = useState<number | null>(null);
    const [loadingBadge, setLoadingBadge] = useState<boolean>(true);

    // 1. Fetch/Subscribe to Companion Profile
    useEffect(() => {
        if (!currentUser?.uid) {
            setProfileLoading(false);
            return;
        }

        setProfileLoading(true);
        const unsub = CompanionRepository.subscribeCompanionProfile(currentUser.uid, (profile) => {
            setCompanionProfile(profile);
            setProfileLoading(false);
        });

        return () => {
            unsub();
        };
    }, [currentUser]);

    // 2. Fetch Booking Count for Badge/Tier
    useEffect(() => {
        let isMounted = true;

        async function fetchBookingCount() {
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
                    setBookingCount(125);
                    setLoadingBadge(false);
                }
            }
        }

        fetchBookingCount();

        return () => {
            isMounted = false;
        };
    }, [currentUser]);

    // 3. Derive Active Badge & Tier Progress (Model calculations)
    const { tier } = calculateTierProgress(bookingCount ?? 0);
    const activeBadge = BADGES.find((b) => b.id.toLowerCase() === tier.toLowerCase()) || BADGES[0];
    const Mascot = activeBadge.mascotMedal;

    // 4. Derive Income Amount
    // If balance_companion exists in profile, parse it to number, otherwise default to 750000 dummy
    const incomeAmount = companionProfile?.balance_companion 
        ? Number(companionProfile.balance_companion) 
        : 750000;

    // 5. Active Status toggling (updates database in CompanionRepository)
    const isActive = companionProfile?.is_active_companion ?? true;

    const handleToggleActive = async (nextState: boolean) => {
        if (!currentUser?.uid) return;
        try {
            await CompanionRepository.updateCompanionProfile(currentUser.uid, {
                is_active_companion: nextState,
            });
        } catch (error) {
            console.error("Error updating companion active status:", error);
        }
    };

    // Dummy data (per user comments, keep dummy for now)
    const dummyFriends: FriendItem[] = [
        {
            friendUid: "f1",
            name: "Budi Santoso",
            photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
            isOnline: true,
        },
        {
            friendUid: "f2",
            name: "Siti Rahma",
            photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
            isOnline: true,
        },
        {
            friendUid: "f3",
            name: "Andi Wijaya",
            photoUrl: "https://randomuser.me/api/portraits/men/62.jpg",
            isOnline: true,
        },
        {
            friendUid: "f4",
            name: "Dewi Lestari",
            photoUrl: "https://randomuser.me/api/portraits/women/12.jpg",
            isOnline: false,
        },
        {
            friendUid: "f5",
            name: "Innocentia",
            photoUrl: "https://randomuser.me/api/portraits/women/20.jpg",
            isOnline: false,
        },
        {
            friendUid: "f6",
            name: "Alvin Yuga",
            photoUrl: "https://randomuser.me/api/portraits/men/14.jpg",
            isOnline: false,
        },
        {
            friendUid: "f7",
            name: "Gilbert Winardy",
            photoUrl: "https://randomuser.me/api/portraits/men/15.jpg",
            isOnline: false,
        },
    ];

    const dummySchedule = {
        id: "s1",
        name: "Rian Hidayat",
        age: 26,
        location: { address: "Coffee Shop Sejahtera, Dago, Bandung" },
        date: "Senin, 29 Juni 2026",
        time: "14:00 - 16:00 WIB",
        isOnline: true,
        avatar: "https://randomuser.me/api/portraits/men/85.jpg",
        bookingUid: "12345678901234567890",
    };

    const handleRewardsPress = () => {
        console.log("Rewards button pressed");
    };

    const handleSchedulePress = () => {
        console.log("Schedule card pressed for:", dummySchedule.name);
    };

    return {
        currentUser,
        presence,
        userProfileContext,
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
        dummyFriends,
        dummySchedule,
        handleRewardsPress,
        handleSchedulePress,
    };
}
