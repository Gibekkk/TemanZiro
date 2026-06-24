import { UserRole, GENDER } from "@/constants/UserDetails";

export interface UserOnlineStatus {
    is_online: boolean;
    last_seen: FirebaseFirestoreTypes.Timestamp | null;
}

export interface UserDetails {
    role: typeof UserRole[keyof typeof UserRole];
    preferences: string[];
    is_verified: boolean;
    is_complete: boolean;
    is_active: boolean;
    url_ktp_user: string | null;
    url_selfiektp_user: string | null;
    companion_cv: string | null;
    companion_phonenumber: string | null;
    created_at: FirebaseFirestoreTypes.Timestamp | null;
    updated_at: FirebaseFirestoreTypes.Timestamp | null;
}

export interface UserProfile {
    uid: string;
    name_user: string;
    gender_user: typeof GENDER[keyof typeof GENDER];
    age_user: number;
    city: string;
    balance_user: string | null;
    url_photoprofile_user: string | null;
    created_at: FirebaseFirestoreTypes.Timestamp | null;
    updated_at: FirebaseFirestoreTypes.Timestamp | null;
}