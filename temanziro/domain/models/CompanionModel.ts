import { Gender } from "@/constants/UserDetails";
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
    registered_date: FirebaseFirestoreTypes.Timestamp | null;
    created_at: FirebaseFirestoreTypes.Timestamp | null;
    updated_at: FirebaseFirestoreTypes.Timestamp | null;
}