import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ActivityType, TimeMode, BookingStatus } from "@/constants/BookingDetails";
import { Gender } from "@/constants/UserDetails";

export type Day = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export interface Bookings {
    activity_name: ActivityType;
    age_range_companion: [number, number];
    gender_companion: Gender;
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
        time_mode: TimeMode;
        start_time: string;
        end_time: string;
    };
    booking_status: BookingStatus;
    total_price: number;
    created_at: FirebaseFirestoreTypes.Timestamp;
    updated_at: FirebaseFirestoreTypes.Timestamp;
}

export interface BookingCompanion {
    bookings: FirebaseFirestoreTypes.DocumentReference<Bookings>;
}