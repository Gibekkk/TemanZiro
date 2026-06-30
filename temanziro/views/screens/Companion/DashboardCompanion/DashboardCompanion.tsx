import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MainLayoutCompanion from "@/views/layouts/MainLayout/MainLayoutCompanion";
import FriendList from "@/views/components/FriendList/FriendList";
import Badge from "@/views/components/Badge/Badge";
import ScheduleCard from "@/views/components/ScheduleCard/ScheduleCard";
import styles from "./DashboardCompanion.style";
import MapIcon from "@/assets/icon/map-pin.svg";
import StatCard from "@/views/components/UI/IconLabel/StatCard";
import StatusToggle from "@/views/components/UI/StatusToggle/StatusToggle";
import IconPendapatan from "@/assets/icon/pendapatan.svg";
import IconSesi from "@/assets/icon/totalmatch.svg";
import IconRating from "@/assets/icon/medal.svg";
import { useCompanionDashboard } from "@/controllers/hooks/Companion/useCompanionDashboard";

export default function DashboardCompanion() {
    const {
        theme,
        companionProfile,
        profileLoading,
        bookingCount,
        loadingBadge,
        incomeAmount,
        isActive,
        handleToggleActive,
        Mascot,
        friends,
        schedule,
        handleRewardsPress,
        handleSchedulePress,
    } = useCompanionDashboard();

    return (
        <MainLayoutCompanion showHeader={true} useScrollView={true} isDashboard={true}>
            <View style={[styles.headerBody, { backgroundColor: theme.colors.tertiaryBackground }]}>
                <View style={styles.mascotImgContainer}>
                    <Mascot
                        style={{
                            position: "absolute",
                            bottom: -20,
                            alignSelf: "center",
                        }}
                        width={170}
                        height={170}
                    />
                </View>
                <View style={[styles.textHeaderWrapper]}>
                    <Text style={[styles.textHeader, { color: theme.colors.textPrimary }]}>
                        Hi, {profileLoading ? "Loading..." : companionProfile?.name_companion || "Teman Ziro"}
                    </Text>
                    <View style={styles.location}>
                        <MapIcon width={15} height={15} />
                        <Text
                            style={[
                                styles.textSubheader,
                                { color: theme.colors.textSecondary },
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {profileLoading ? "..." : companionProfile?.city_companion || "Lokasi belum tersedia"}
                        </Text>
                    </View>
                    <View style={[styles.boxHeader]}>
                        <StatusToggle isActive={isActive} onToggle={handleToggleActive} />
                    </View>
                </View>
            </View>

            <View style={styles.bodySection}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chat Berlangsung</Text>
                    <FriendList friendsData={friends} isLoading={false} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Agenda Hari ini</Text>
                    {schedule ? (
                        <ScheduleCard schedule={schedule} onPress={handleSchedulePress} />
                    ) : (
                        <View style={{ paddingVertical: 12, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Belum ada agenda hari ini</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    {loadingBadge ? (
                        <ActivityIndicator size="small" color="#d95d16" />
                    ) : (
                        <Badge
                            bookingCount={bookingCount ?? 0}
                            onRewardsPress={handleRewardsPress}
                        />
                    )}
                </View>
                <View style={styles.tierDetailsContainer}>
                    <StatCard
                        title="Pendapatan"
                        value={incomeAmount}
                        IconComponent={IconPendapatan}
                        isCurrency={true}
                        style={styles.tierCard}
                    />
                    <StatCard
                        title="Total Sesi"
                        value={5}
                        IconComponent={IconSesi}
                        style={styles.tierCard}
                    />
                    <StatCard
                        title="Rating"
                        value={4.5}
                        IconComponent={IconRating}
                        style={styles.tierCard}
                    />
                </View>

            </View>
        </MainLayoutCompanion>
    );
}

