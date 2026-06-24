import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ACTIVITY_TYPE, TIME_MODE, BOOKING_STATUS } from "@/constants/BookingDetails";
import { GENDER } from "@/constants/UserDetails";

export type Day = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export interface Bookings {
    activity_name: typeof ACTIVITY_TYPE[number]["value"];
    age_range_companion: [number, number];
    gender_companion: typeof GENDER[keyof typeof GENDER];
    location: {
        address: string;
        latitude: number;
        longitude: number;
    };
    preference_companion: string[];
    schedule: {
        start_day: Day;
        start_date: FirebaseFirestoreTypes.Timestamp;
        end_day: Day;
        end_date: FirebaseFirestoreTypes.Timestamp;
        time_mode: typeof TIME_MODE[keyof typeof TIME_MODE];
        start_time: string;
        end_time: string;
    };
    booking_status: typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
    total_price: number;
    created_at: FirebaseFirestoreTypes.Timestamp;
    updated_at: FirebaseFirestoreTypes.Timestamp;
}

export interface BookingCompanion {
    bookings: FirebaseFirestoreTypes.DocumentReference<Bookings>;
}