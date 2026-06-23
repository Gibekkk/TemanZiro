import { UserRole, Gender } from "@/constants/UserDetailConstant";

export interface UserOnlineStatus {
    is_online: boolean;
    last_seen: Date | null;
}

export interface UserDetails {
    role: UserRole;
    preferences: string[];
    is_verified: boolean;
    is_complete: boolean;
    is_active: boolean;
    url_ktp_user: string | null;
    url_selfiektp_user: string | null;
    companion_cv: string | null;
    companion_phonenumber: string | null;
    created_at: Date | null;
    updated_at: Date | null;
}

export interface UserProfile {
    uid: string;
    name_user: string;
    gender_user: Gender;
    age_user: number;
    city: string;
    balance_user: string | null;
    url_photoprofile_user: string | null;
    created_at: Date | null;
    updated_at: Date | null;
}