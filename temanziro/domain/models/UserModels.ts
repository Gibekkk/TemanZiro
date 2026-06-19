export type UserRole = "booker" | "companion" | null;

export interface UserOnlineStatus {
    is_online: boolean;
    last_seen: Date | null;
}

export interface UserDetails {
    role: "admin" | "companion" | "booker";
    is_verified: boolean;
    is_complete: boolean;
}

export interface UserProfile {
    uid: string;
    name: string;
    balance_user: string;
}