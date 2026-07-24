import { Gender } from "@/constants/UserDetails";
import { AddOnStatus } from "@/constants/AddOnConstant";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface CompanionProfile {
    uid: string;
    name_companion: string;
    gender_companion: Gender;
    age_companion: number;
    city_companion: string;
    address_companion: string | null;
    balance_companion: string | null;
    url_photoprofile_companion: string | null;
    is_active_companion: boolean;
    philosophy_companion: string | null;
    preference_activity_companion: string[];
    preference_companion: string[];
    companion_rating: {
        count_rating: {
            "1": number;
            "2": number;
            "3": number;
            "4": number;
            "5": number;
        };
        average_rating: number;
    };
    schedule: {
        days: string[];
        time: [number, number] | null;
    },
    addon_status?: AddOnStatus | null;
    registered_date: FirebaseFirestoreTypes.Timestamp | null;
    created_at: FirebaseFirestoreTypes.Timestamp | null;
    updated_at: FirebaseFirestoreTypes.Timestamp | null;
}

export interface CompanionBookingCount {
    booking_count: number;
    last_synced?: FirebaseFirestoreTypes.Timestamp | null;
}