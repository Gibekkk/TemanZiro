import { CompanionProfile } from "@/domain/models/CompanionModel";
import { GENDER } from "./UserDetails";
import { FriendItem } from "@/views/components/FriendList/FriendList";

export const USE_DUMMY_DATA = true;

export const DUMMY_BOOKING_COUNT = 125;

export const DUMMY_COMPANION_PROFILE: CompanionProfile = {
    uid: "156131498",
    name_companion: "Inno",
    gender_companion: GENDER.WANITA,
    age_companion: 23,
    city_companion: "Makassar",
    address_companion: "Jl. Sunset Boulevard",
    balance_companion: "199000000",
    url_photoprofile_companion: "",
    is_active_companion: true,
    philosophy_companion: "Keep coding and stay humble.",
    preference_activity_companion: ["belajar", "olahraga", "nongkrong"],
    preference_companion: ["Friendly", "Polite"],
    registered_date: null,
    created_at: null,
    updated_at: null,
};

export const DUMMY_FRIENDS: FriendItem[] = [
    {
        friendUid: "f1",
        name: "Budi Santoso",
        photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        isOnline: true,
    },
    {
        friendUid: "f2",
        name: "Siti Rahma",
        photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        isOnline: true,
    },
    {
        friendUid: "f3",
        name: "Andi Wijaya",
        photoUrl: "https://randomuser.me/api/portraits/men/62.jpg",
        isOnline: true,
    },
    {
        friendUid: "f4",
        name: "Dewi Lestari",
        photoUrl: "https://randomuser.me/api/portraits/women/12.jpg",
        isOnline: false,
    },
    {
        friendUid: "f5",
        name: "Innocentia",
        photoUrl: "https://randomuser.me/api/portraits/women/20.jpg",
        isOnline: false,
    },
    {
        friendUid: "f6",
        name: "Alvin Yuga",
        photoUrl: "https://randomuser.me/api/portraits/men/14.jpg",
        isOnline: false,
    },
    {
        friendUid: "f7",
        name: "Gilbert Winardy",
        photoUrl: "https://randomuser.me/api/portraits/men/15.jpg",
        isOnline: false,
    },
];

export const DUMMY_SCHEDULE = {
    id: "s1",
    name: "Rian Hidayat",
    age: 26,
    location: { address: "Coffee Shop Sejahtera, Dago, Bandung" },
    date: "Senin, 29 Juni 2026",
    time: "14:00 - 16:00 WIB",
    isOnline: true,
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    bookingUid: "12345678901234567890",
};

export const DUMMY_COMPANION_RATING = {
    overall_rating: 4.8,
    count_rating: {
        "5": 12,
        "4": 3,
        "3": 1,
        "2": 0,
        "1": 0
    }
};

export const DUMMY_REVIEWS = [
    {
        id: "REV-1",
        name: "Siti Rahma",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        text: "Sangat ramah dan menyenangkan diajak ngobrol!",
    },
    {
        id: "REV-2",
        name: "Andi Wijaya",
        avatar: "https://randomuser.me/api/portraits/men/62.jpg",
        rating: 4,
        text: "Orangnya sopan dan seru, recommended!",
    }
];
