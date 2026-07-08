import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import styles from './ScheduleTabs.style';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import { useTheme } from '@/controllers/hooks/useTheme';
import IconArrowRight from '@/assets/icon/arrowright.svg';
import { useRouter } from 'expo-router';

interface ScheduleTabsProps {
    role: 'companion' | 'booker' | string;
    tabs?: string[];
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    loading?: boolean;
    filteredSchedules?: any[];
    handleScheduleClick?: (schedule: any) => void;
    onViewAllPress?: (activeTab: string) => void;
}

const COMPANION_TABS = ["Permintaan", "Terkonfirmasi", "Berlangsung", "Selesai", "Batal"];
const USER_TABS = ["Menunggu Pembayaran", "Mencari", "Konfirmasi", "Berlangsung", "Selesai"];

export default function ScheduleTabs({
    role,
    tabs,
    activeTab,
    setActiveTab,
    loading = false,
    filteredSchedules = [],
    handleScheduleClick,
    onViewAllPress,
}: ScheduleTabsProps) {
    const { theme } = useTheme();
    const router = useRouter();

    const defaultTabs = role === 'companion' ? COMPANION_TABS : USER_TABS;
    const currentTabs = tabs || defaultTabs;

    const [internalActiveTab, setInternalActiveTab] = useState<string | null>(null);
    const currentActiveTab = activeTab !== undefined ? activeTab : (internalActiveTab || currentTabs[0] || 'Konfirmasi');
    const currentSetActiveTab = setActiveTab !== undefined ? setActiveTab : setInternalActiveTab;

    const handleViewAll = () => {
        // if (onViewAllPress) {
        //     onViewAllPress(currentActiveTab);
        // } else {
        //     try {
        //         router.push({
        //             pathname: '/(tabs)/booking',
        //             params: { status: currentActiveTab }
        //         });
        //     } catch (e) {
        //         console.warn('Navigation to list bookings failed:', e);
        //     }
        // }
    };

    const onSchedulePress = (schedule: any) => {
        if (handleScheduleClick) {
            handleScheduleClick(schedule);
        } else {
            console.log('Schedule clicked:', schedule.id);
            if (schedule.bookingUid) {
                router.push({
                    pathname: '/common/chatscreen',
                    params: {
                        bookingId: schedule.bookingUid,
                        companionName: schedule.name,
                    }
                });
            }
        }
    };

    return (
        <View style={[styles.bottomSheet, { backgroundColor: theme.colors.primaryBackground, borderColor: theme.colors.border }]}>
            {/* Tabs Container */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabBarScroll}
                style={[styles.tabBar, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}
            >
                {currentTabs.map((tab) => {
                    const isActive = currentActiveTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => currentSetActiveTab(tab)}
                            activeOpacity={0.8}
                            style={[
                                styles.tabItem,
                                isActive && {
                                    borderBottomColor: theme.colors.primary,
                                    borderBottomWidth: 2
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    { color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary }
                                ]}
                            >
                                {tab.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Jadwal Kamu</Text>
                <TouchableOpacity style={styles.viewAll} onPress={handleViewAll}>
                    <Text style={[styles.viewAllText, { color: theme.colors.secondary }]}>View all</Text>
                    <IconArrowRight width={14} height={14} fill={theme.colors.secondary} />
                </TouchableOpacity>
            </View>

            {/* Schedule List Container */}
            <View style={styles.scheduleListContainer}>
                {loading ? (
                    <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={theme.colors.secondary} />
                        <Text style={[styles.emptyState, { color: theme.colors.textSecondary, marginTop: 8 }]}>
                            Memuat jadwal...
                        </Text>
                    </View>
                ) : filteredSchedules.length > 0 ? (
                    filteredSchedules.slice(0, 1).map((schedule) => (
                        <ScheduleCard
                            key={schedule.id || schedule.bookingUid}
                            schedule={schedule}
                            onPress={() => onSchedulePress(schedule)}
                        />
                    ))
                ) : (
                    <Text style={[styles.emptyState, { color: theme.colors.textSecondary }]}>
                        Belum ada jadwal untuk status "{currentActiveTab}".
                    </Text>
                )}
            </View>
        </View>
    );
}
