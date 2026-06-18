
import { ActivityType, BookingStatus, MeetStatus, PaymentStatus } from "./users";

export type WithdrawalStatus = "pending" | "berhasil" | "ditolak";

export const WITHDRAWAL_STATUS_MAP: Record<WithdrawalStatus, string> = {
    pending: "pending",
    berhasil: "berhasil",
    ditolak: "ditolak"
}

export interface companion_detail {
    name_companion: string;
    address_companion: string;
    is_active_companion: boolean;
    url_photoprofile_companion: string;
    url_mascot_emblem: string;
    reward_status: string;
    total_session: number;
    income: number;
}

export interface active_chat {
    name_user: string;
    is_online_user: boolean;
    url_photoprofile_user: string;
}

export interface active_activity {
    name_user: string;
    age_user: number;
    is_online_user: boolean;
    meet_address: string;
    meet_datetime: string;
    booking_status: BookingStatus;
}

export interface chat_information {
    name_user: string;
    url_photoprofile_user: string;
    is_online_user: boolean;
    last_chat: string;
    lastchat_datetime: Date;
}

export interface chat_companion {
    url_photoprofile_companion: string;
    url_photoprofile_user: string;
    activity_type: ActivityType;
    meet_datetime: Date;
    meet_address: string;
    payment_status: PaymentStatus;
    booking_status: BookingStatus;
}

export interface companion_profile {
    id?: string;
    url_photoprofile_companion: string;
    name_companion: string;
    preference_companion: string[];
    gender_companion: string;
    age_companion?: number;
    address_companion: string;
    city_companion: string;
    philosophy_companion: string;
    preference_activity_companion: string[];
    is_active_companion: boolean;
    is_online_companion: boolean;
    companion_rating: {
        count_rating: {
            "1": number;
            "2": number;
            "3": number;
            "4": number;
            "5": number;
        };
        overall_rating: number;
    };
    registered_date: string;
}

export interface companion_rating {
    overall_rating: number;
    counter_rating: number;
}

export interface companion_review {
    profile_user_ref: string; // reference to profile_user id
    comment: string;
    rating: boolean; // true for positive, false for negative?
}

export interface notification_alert {
    notification_content: string;
    notification_datetime: Date;    
}

export interface history_status_card {
    is_online_user: boolean;
    url_photoprofile_user: string;
    name_user: string;
    meet_address: string;
    meet_datetime: Date;
    meet_dataus: MeetStatus;
}

export interface header_companion {
    url_photoprofile_companion: string;
    notification_count: number;
}

export interface meeting_information_companion {
    countdown_before_meet: number;
    meet_status: MeetStatus;
    meet_datetime: Date;
    meet_address: string;
}

export interface user_information {
    name_user: string;
    preference_user: string[];
}

export interface address_user_companion {
    address_user: string;
    address_companion: string;
    url_photoprofile_user: string;
    url_photoprofile_companion: string;
}

export interface meeting_status_companion {
    meet_status: MeetStatus;
    countdown_session: number;
    meet_address: string;
}

export interface session_stop_companion {
    url_photoprofile_user: string;
    countdown_session: number;
    name_user: string;
}

export interface payment_header_companion {
    payment_status: PaymentStatus;
    companion_fee: number;
}

export interface payment_body_companion {
    name_user: string;
    companion_fee: number;
    preference_user: string[];
    meet_address: string;
    payment_datetime: Date;
    meet_datetime: Date;
    meet_duration: number;
    meet_longitude: string;
    meet_latitude: string;
    meet_notes: string;
}

export interface wallet {
    companion_fee_total: number;
    companion_registered_date: Date;
    name_companion: string;
}

export interface withdrawal {
    withdrawal_request_datetime: Date;
    withdrawal_amount: number;
    withdrawal_completed_datetime: Date;
    bank_name: string;
    withdrawal_status: WithdrawalStatus;
}

export interface withdrawal_pending {
    withdrawal_request_datetime: Date;
    bank_name: string;
    withdrawal_status: WithdrawalStatus;
    withdrawal_amount: number;
}

export interface withdrawal_information {
    withdrawal_completed_datetime: Date;
    bank_name: string;
    withdrawal_status: WithdrawalStatus;
    withdrawal_amount: number;
}

export interface withdrawal_request {
    withdrawal_request_datetime: Date;
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    withdrawal_amount: number;
}