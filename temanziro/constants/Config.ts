import { CompanionProfile } from "@/domain/models/CompanionModel";
import { GENDER } from "./UserDetails";
import { FriendItem } from "@/views/components/FriendList/FriendList";
import { ChatMessage } from "@/domain/models/ChatModel";

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
    companion_rating: {
        count_rating: { "1": 0, "2": 0, "3": 1, "4": 3, "5": 11 },
        average_rating: 4.8,
    },
    schedule: {
        days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
        time: [720, 1080],
    },
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

export const DUMMY_LOCATIONS = [
    "Jakarta Selatan, DKI Jakarta",
    "Jakarta Barat, DKI Jakarta",
    "Jakarta Pusat, DKI Jakarta",
    "Bandung City, West Java",
    "Surabaya, East Java",
    "Makassar, South Sulawesi",
    "Medan, North Sumatra",
    "Yogyakarta, DI Yogyakarta",
    "Semarang, Central Java",
    "Tangerang, Banten",
    "Jl. Sunset Boulevard, Makassar",
    "Jl. Sudirman, Jakarta",
    "Jl. Malioboro, Yogyakarta",
    "Coffee Shop Sejahtera, Dago, Bandung",
];

export const DUMMY_CHATS = [
    {
        id: "chat1",
        name_user: "Budi Santoso",
        name_companion: "Inno",
        url_photoprofile_user: "https://randomuser.me/api/portraits/men/32.jpg",
        url_photoprofile_companion: "https://randomuser.me/api/portraits/women/20.jpg",
        last_chat: "Halo! Saya sudah sampai di kafe ya.",
        lastchat_datetime: { toDate: () => new Date() }, // Mock Timestamp object
        is_online_companion: true,
        booking_status: "berlangsung",
    },
    {
        id: "chat2",
        name_user: "Siti Rahma",
        name_companion: "Inno",
        url_photoprofile_user: "https://randomuser.me/api/portraits/women/44.jpg",
        url_photoprofile_companion: "https://randomuser.me/api/portraits/women/20.jpg",
        last_chat: "Terima kasih banyak untuk jalan-jalannya hari ini!",
        lastchat_datetime: { toDate: () => new Date(Date.now() - 24 * 60 * 60 * 1000) },
        is_online_companion: false,
        booking_status: "selesai",
    },
    {
        id: "chat3",
        name_user: "Andi Wijaya",
        name_companion: "Inno",
        url_photoprofile_user: "https://randomuser.me/api/portraits/men/62.jpg",
        url_photoprofile_companion: "https://randomuser.me/api/portraits/women/20.jpg",
        last_chat: "Bisa kirim lokasinya?",
        lastchat_datetime: { toDate: () => new Date(Date.now() - 30 * 60 * 1000) },
        is_online_companion: true,
        booking_status: "konfirmasi",
    },
    {
        id: "chat4",
        name_user: "Dewi Lestari",
        name_companion: "Inno",
        url_photoprofile_user: "https://randomuser.me/api/portraits/women/12.jpg",
        url_photoprofile_companion: "https://randomuser.me/api/portraits/women/20.jpg",
        last_chat: "Terima kasih, sangat menyenangkan.",
        lastchat_datetime: { toDate: () => new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        is_online_companion: false,
        booking_status: "selesai",
    },
];

export const DUMMY_MESSAGES_MAP: Record<string, ChatMessage[]> = {
    "chat1": [
        {
            id: "m1_1",
            chat: "Halo Budi! Ada yang bisa saya bantu untuk booking hari ini?",
            sender_is_user: false,
            created_at: { toDate: () => new Date(Date.now() - 30 * 60 * 1000) } as any,
            reference_booking: null as any,
        },
        {
            id: "m1_2",
            chat: "Halo! Saya sudah sampai di kafe ya.",
            sender_is_user: true,
            created_at: { toDate: () => new Date(Date.now() - 15 * 60 * 1000) } as any,
            reference_booking: null as any,
        }
    ],
    "chat2": [
        {
            id: "m2_1",
            chat: "Halo Siti, bagaimana perjalanan hari ini?",
            sender_is_user: false,
            created_at: { toDate: () => new Date(Date.now() - 2 * 3600 * 1000) } as any,
            reference_booking: null as any,
        },
        {
            id: "m2_2",
            chat: "Terima kasih banyak untuk jalan-jalannya hari ini!",
            sender_is_user: true,
            created_at: { toDate: () => new Date(Date.now() - 1 * 3600 * 1000) } as any,
            reference_booking: null as any,
        }
    ],
    "chat3": [
        {
            id: "m3_1",
            chat: "Saya sedang di jalan menuju kesana.",
            sender_is_user: false,
            created_at: { toDate: () => new Date(Date.now() - 40 * 60 * 1000) } as any,
            reference_booking: null as any,
        },
        {
            id: "m3_2",
            chat: "Bisa kirim lokasinya?",
            sender_is_user: true,
            created_at: { toDate: () => new Date(Date.now() - 30 * 60 * 1000) } as any,
            reference_booking: null as any,
        }
    ],
    "chat4": [
        {
            id: "m4_1",
            chat: "Mohon maaf ada keperluan mendadak.",
            sender_is_user: true,
            created_at: { toDate: () => new Date(Date.now() - 24 * 3600 * 1000) } as any,
            reference_booking: null as any,
        },
        {
            id: "m4_2",
            chat: "saya akan sedikit terlambat.",
            sender_is_user: true,
            created_at: { toDate: () => new Date(Date.now() - 23 * 3600 * 1000) } as any,
            reference_booking: null as any,
        }
    ]
};


