import { useState, useEffect } from "react";
import { useRouter, useSegments, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { useTheme } from "@/controllers/hooks/useTheme";
import firestore from "@react-native-firebase/firestore";
import { USE_DUMMY_DATA, DUMMY_BOOKINGS } from "@/constants/Config";
import { UserRepository } from "@/data/repositories/UserRepository";
import { CompanionRepository } from "@/data/repositories/CompanionRepository";

export interface BookingData {
    id: string;
    companionId: string;
    userId: string;
    name: string;
    age: number;
    avatar: string;
    status: string;
    bookingRefPath: string;
    activityName: string;
    date: string;
    time: string;
    location: string;
}

export function useTemanJalan() {
    const router = useRouter();
    const segments = useSegments() as string[];
    const { role: paramRole } = useLocalSearchParams() as { role?: string };
    const { currentUser } = useAuth();
    const { role: contextRole } = useUserProfile();
    const { theme } = useTheme();

    const [featuredDataList, setFeaturedDataList] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const isCompanion = segments.includes("(tabs_companion)") || contextRole === "companion" || paramRole === "companion";
    const resolvedRole = isCompanion ? "companion" : "booker";

    useEffect(() => {
        if (USE_DUMMY_DATA) {
            const dummyList: BookingData[] = DUMMY_BOOKINGS.map(item => ({
                id: item.id,
                companionId: item.companionId,
                userId: item.userId,
                name: isCompanion ? item.name_user : item.name_companion,
                age: isCompanion ? item.age_user : item.age_companion,
                avatar: isCompanion ? item.url_photoprofile_user : item.url_photoprofile_companion,
                status: item.status,
                bookingRefPath: item.bookingRefPath,
                activityName: item.activityName,
                date: item.date,
                time: item.time,
                location: item.location,
            }));
            setFeaturedDataList(dummyList);
            setLoading(false);
            return;
        }

        if (!currentUser?.uid) {
            setFeaturedDataList([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const queryField = isCompanion ? "companion_uid" : "user_uid";

        const unsubscribe = firestore()
            .collection("bookings")
            .where(queryField, "==", currentUser.uid)
            .where("booking_status", "in", ["konfirmasi", "berlangsung"])
            .onSnapshot(async (snapshot) => {
                if (!snapshot || snapshot.empty) {
                    setFeaturedDataList([]);
                    setLoading(false);
                    return;
                }

                try {
                    const resolvedBookings: BookingData[] = [];

                    for (const doc of snapshot.docs) {
                        const data = doc.data();
                        const otherPartyUid = isCompanion ? data.user_uid : data.companion_uid;

                        let name = "Teman Ziro";
                        let avatar = "";

                        if (otherPartyUid) {
                            try {
                                if (isCompanion) {
                                    const userProfile = await UserRepository.getUserProfile(otherPartyUid);
                                    if (userProfile) {
                                        name = userProfile.name_user || "User";
                                        avatar = userProfile.url_photoprofile_user || "";
                                    }
                                } else {
                                    const companionProfile = await CompanionRepository.getCompanionProfile(otherPartyUid);
                                    if (companionProfile) {
                                        name = companionProfile.name_companion || "Companion";
                                        avatar = companionProfile.url_photoprofile_companion || "";
                                    }
                                }
                            } catch (profileError) {
                                console.warn(`Error resolving profile for UID ${otherPartyUid}:`, profileError);
                            }
                        }

                        let dateStr = "Belum dijadwalkan";
                        if (data.schedule?.start_date) {
                            try {
                                const startDate = typeof data.schedule.start_date.toDate === "function"
                                    ? data.schedule.start_date.toDate()
                                    : new Date(data.schedule.start_date);

                                const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
                                dateStr = startDate.toLocaleDateString('id-ID', options);
                            } catch (e) {
                                console.error("Error parsing date:", e);
                            }
                        }

                        const timeStr = data.schedule?.start_time && data.schedule?.end_time
                            ? `${data.schedule.start_time} - ${data.schedule.end_time} WIB`
                            : "Waktu tidak ditentukan";

                        resolvedBookings.push({
                            id: doc.id,
                            companionId: data.companion_uid || "",
                            userId: data.user_uid || "",
                            name,
                            age: isCompanion ? data.age_user : data.age_companion,
                            avatar,
                            status: data.booking_status || "",
                            bookingRefPath: doc.ref.path,
                            activityName: data.activity_name || "Aktivitas",
                            date: dateStr,
                            time: timeStr,
                            location: data.location?.address || "Lokasi tidak ditentukan",
                        });
                    }

                    setFeaturedDataList(resolvedBookings);
                } catch (err) {
                    console.error("Error processing resolved bookings:", err);
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error("Firestore active bookings subscription error:", error);
                setLoading(false);
            });

        return () => unsubscribe();
    }, [currentUser?.uid, isCompanion]);

    const handleChatPress = (booking: BookingData) => {
        router.push({
            pathname: "/common/chatscreen",
            params: {
                companionId: isCompanion ? booking.userId : booking.companionId,
                companionName: booking.name,
                companionAvatar: booking.avatar,
                bookingStatus: booking.status,
                bookingId: booking.id,
            }
        });
    };

    return {
        loading,
        featuredDataList,
        role: resolvedRole,
        isCompanion,
        theme,
        handleChatPress,
    };
}
