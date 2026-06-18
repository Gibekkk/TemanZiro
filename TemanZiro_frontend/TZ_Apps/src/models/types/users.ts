import { DocumentReference } from "firebase/firestore/lite";

export type ActivityType = "nongkrong" | "olahraga" | "belajar" | "jalan-jalan" | "hiburan" | "kuliner";
export type PaymentStatus = "pending" | "verified";
export type BookingStatus = "mencari" | "konfirmasi" | "berlangsung" | "selesai" | "batal";
export type MeetStatus = "mencari" | "konfirmasi" | "berlangsung" | "selesai" | "batal";

export const ACTIVITY_STATUS_MAP: Record<string, ActivityType> = {
  NONGKRONG: "nongkrong",
  OLAHRAGA: "olahraga",
  BELAJAR: "belajar",
  JALAN_JALAN: "jalan-jalan",
  HIBURAN: "hiburan",
  KULINER: "kuliner",
};

export const PAYMENT_STATUS_MAP: Record<string, PaymentStatus> = {
  PENDING: "pending",
  VERIFIED: "verified",
};

export const MEET_STATUS_MAP: Record<string, MeetStatus> = {
  PENDING: "mencari",
  CONFIRMED: "konfirmasi",
  ONGOING: "berlangsung",
  DONE: "selesai",
  CANCELLED: "batal",
};

export const BOOKING_STATUS_MAP: Record<string, BookingStatus> = {
  PENDING: "mencari",
  CONFIRMED: "konfirmasi",
  ONGOING: "berlangsung",
  DONE: "selesai",
  CANCELLED: "batal",
};

export interface user_detail {
    name_user: string;
    city_user: string;
    url_photoprofile_user: string;
}

export interface active_friend {
    name_companion?: string;
    is_online_companion?: boolean;
    url_photoprofile_companion?: string;
}

export interface chat_information {
    url_photoprofile_companion?: string;
    name_companion?: string;
    url_photoprofile_user?: string;
    is_online_companion?: boolean;
    last_chat: string;
    lastchat_datetime: Date;
}

export interface chat_user {
    url_photoprofile_companion?: string;
    url_photoprofile_user?: string;
    activity_type: ActivityType;
    meet_datetime: Date;
    meet_address: string;
    payment_status: PaymentStatus;
    booking_status: BookingStatus;
}

export interface user_details {
    role?: "booker" | "companion";
    url_ktp_user?: string;
    url_selfiektp_user?: string;
    is_complete?: boolean;
}

export interface user_profile {
    url_photoprofile_user?: string;
    name_user?: string;
    gender_user?: string;
    age_user?: number;
    city?: string;
    user_details?: user_details;
    createAt?: Date;
    updateAt?: Date;
}


export interface booking_status_card {
    booking_status: BookingStatus;
    url_photoprofile_user?: string;
    is_online_companion: boolean;
    meet_address: string;
    meet_datetime: Date;
    meet_status: MeetStatus;
}

export interface today_booking {
    is_online_companion: boolean;
    url_photoprofile_user?: string;
    meet_address: string;
    meet_datetime: Date;
    booking_notes: string;
}

export interface header_user {
    url_photoprofile_user?: string;
}

export interface meeting_information {
    countdown_before_meet: number;
    meet_status: MeetStatus;
    meet_datetime: Date;
    meet_address: string;
}

export interface companion_information {
    name_companion: string;
    companion_rating: number;
    preference_companion: string[];
}

export interface address_user_companion {
    city_user?: string;
    city_companion?: string;
    url_photoprofile_user?: string;
    url_photoprofile_companion?: string;
}

export interface meeting_status {
    meet_status: MeetStatus;
    countdown_session: number;
    meet_address: string;
}

export interface session_stop {
    url_photoprofile_companion?: string;
    countdown_session: number;
    name_companion: string;
}

export interface payment_header {
    payment_status: PaymentStatus;
    payment_total: number;
}

export interface payment_body {
    name_companion: string;
    meeting_fee: number;
    service_fee: number;
    preference_activity_user: ActivityType[];
    meet_address: string;
    payment_datetime: Date;
    meet_datetime: Date;
    meet_duration: number;
    meet_longitude: string;
    meet_latitude: string;
    meet_notes: string;
}

export interface companion_matching {
    preference_activity_user: ActivityType[];
    preference_user: string[];
    meet_datetime: Date;
}

export interface companion_matched {
    name_companion: string;
    age_companion: number;
    preference_activity_user: ActivityType[];
    meet_address: string;
    preference_companion: string[];
}

export interface companion_profile {
    name_companion: string;
    preference_companion: string[];
    session_total: number;
    is_verified_companion: boolean;
    rating_companion: number;
    philosophy_companion: string;
    companion_registered_date: Date;
    preference_activity_companion: ActivityType[];
}

export interface payment_confirmation {
    name_companion: string;
    preference_activity_companion: ActivityType[];
    meet_address: string;
    meet_datetime: Date;
    meet_latitude: string;
    meet_longitude: string;
    meeting_fee: number;
    service_fee: number;
    total_fee: number;
    payment_code: string;
}

export interface payment_code {
    payment_code: string;
    total_fee: number;
}

export interface payment_complete {
    payment_status: PaymentStatus;
}



export interface DashboardUser {
  profile_user?: DocumentReference;
  active_friend?: DocumentReference[];
}   

export interface preference_list {
    preference_names: string[];
}

// export interface UserRegistrationData {
//     uid?: string;
//     role: string;
//     name_user?: string;
//     url_ktp_user?: string;
//     url_selfiektp_user?: string;
//     is_complete: boolean;
//     createdAt?: any;
// }