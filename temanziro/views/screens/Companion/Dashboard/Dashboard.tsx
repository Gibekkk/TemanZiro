import React from "react";
import { View, Text } from "react-native";
import MainLayout from "@/views/layouts/MainLayout/MainLayout";
import FriendList from "@/views/components/FriendList/FriendList";
import IncomeCard from "@/views/components/UI/IconLabel/IncomeCard";
import Badge from "@/views/components/Badge/Badge";
import ScheduleCard from "@/views/components/ScheduleCard/ScheduleCard";
import { UserProfile } from "@/domain/models/UserModels";
import styles from "./Dashboard.style";

export default function DataScreenKTPPage() {

    const dummyBadge = {
        tier: "gold",
        currentProgress: 6,
        maxProgress: 10,
    };

    const dummyFriends: UserProfile[] = [
        {
            uid: "f1",
            name_user: "Budi Santoso",
            gender_user: "pria",
            age_user: 24,
            city: "Jakarta",
            balance_user: null,
            url_photoprofile_user: "https://randomuser.me/api/portraits/men/32.jpg",
            created_at: null,
            updated_at: null,
        },
        {
            uid: "f2",
            name_user: "Siti Rahma",
            gender_user: "wanita",
            age_user: 22,
            city: "Bandung",
            balance_user: null,
            url_photoprofile_user: "https://randomuser.me/api/portraits/women/44.jpg",
            created_at: null,
            updated_at: null,
        },
        {
            uid: "f3",
            name_user: "Andi Wijaya",
            gender_user: "pria",
            age_user: 27,
            city: "Surabaya",
            balance_user: null,
            url_photoprofile_user: "https://randomuser.me/api/portraits/men/62.jpg",
            created_at: null,
            updated_at: null,
        },
        {
            uid: "f4",
            name_user: "Dewi Lestari",
            gender_user: "wanita",
            age_user: 25,
            city: "Yogyakarta",
            balance_user: null,
            url_photoprofile_user: "https://randomuser.me/api/portraits/women/12.jpg",
            created_at: null,
            updated_at: null,
        },
    ];

    const dummySchedule = {
        id: "s1",
        status: "aktif",
        name: "Rian Hidayat",
        age: 26,
        location: { address: "Coffee Shop Sejahtera, Dago, Bandung" },
        date: "Senin, 29 Juni 2026",
        time: "14:00 - 16:00 WIB",
        badgeText: "Pendampingan Aktif",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    };

    const handleRewardsPress = () => {
        console.log("Rewards button pressed");
    };

    const handleSchedulePress = () => {
        console.log("Schedule card pressed for:", dummySchedule.name);
    };

    return (
        <MainLayout useScrollView={true}>
            {/* Bagian Badge */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pencapaian Tier</Text>
                <Badge
                    tier={dummyBadge.tier}
                    currentProgress={dummyBadge.currentProgress}
                    maxProgress={dummyBadge.maxProgress}
                    onRewardsPress={handleRewardsPress}
                />
            </View>

            {/* Bagian Pendapatan */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Keuangan Anda</Text>
                <IncomeCard amount="Rp. 750.000" />
            </View>

            {/* Bagian Teman Aktif */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Teman Aktif</Text>
                <FriendList friendsData={dummyFriends} isLoading={false} />
            </View>

            {/* Bagian Jadwal Terdekat */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Jadwal Terdekat</Text>
                <ScheduleCard schedule={dummySchedule} onPress={handleSchedulePress} />
            </View>
        </MainLayout>
    );
}
