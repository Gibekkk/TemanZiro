import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import styles from './ScheduleTabs.style';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import { useTheme } from '@/controllers/hooks/useTheme';
import IconArrowRight from '@/assets/icon/arrowright.svg';
import { useRouter } from 'expo-router';

interface ScheduleTabsProps {
    role: 'companion' | 'booker' | string;
    schedules?: any[];
    tabs?: string[];
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    loading?: boolean;
    handleScheduleClick?: (schedule: any) => void;
    onViewAllPress?: (activeTab: string) => void;
    isFull?: boolean;
}

const COMPANION_TABS = ["Permintaan", "Terkonfirmasi", "Berlangsung", "Selesai", "Batal"];
const USER_TABS = ["Menunggu Pembayaran", "Mencari", "Konfirmasi", "Berlangsung", "Selesai"];

export default function ScheduleTabs({
    role,
    schedules = [],
    tabs,
    activeTab,
    setActiveTab,
    loading = false,
    handleScheduleClick,
    onViewAllPress,
    isFull = false,
}: ScheduleTabsProps) {
    const { theme } = useTheme();
    const router = useRouter();

    const defaultTabs = role === 'companion' ? COMPANION_TABS : USER_TABS;
    const currentTabs = tabs || defaultTabs;

    const [internalActiveTab, setInternalActiveTab] = useState<string | null>(null);
    const currentActiveTab = activeTab !== undefined ? activeTab : (internalActiveTab || currentTabs[0] || 'Konfirmasi');
    const currentSetActiveTab = setActiveTab !== undefined ? setActiveTab : setInternalActiveTab;

    // Filter and map schedules internally based on tab status
    const rawFiltered = schedules.filter((item) => {
        const itemStatus = (item.status || item.badgeText || '').toLowerCase();
        const activeTabLower = currentActiveTab.toLowerCase();
        const normalizedTab = activeTabLower.replace(/\s+/g, '_');

        if (normalizedTab === 'terkonfirmasi' || normalizedTab === 'konfirmasi') {
            return itemStatus === 'konfirmasi' || itemStatus === 'terkonfirmasi';
        }
        return itemStatus === normalizedTab;
    });

    const filteredSchedules = rawFiltered.map((booking) => {
        if (booking.badgeText !== undefined && booking.isOnline !== undefined) {
            return booking;
        }
        return {
            id: booking.id,
            name: booking.name,
            age: booking.age || 0,
            location: booking.location,
            date: booking.date,
            time: booking.time,
            isOnline: false,
            avatar: booking.avatar,
            bookingUid: booking.id,
            badgeText: booking.status,
        };
    });

    const handleViewAll = () => {
        if (onViewAllPress) {
            onViewAllPress(currentActiveTab);
        } else {
            try {
                router.push({
                    pathname: '/common/listbooking',
                    params: { status: currentActiveTab, role: role }
                });
            } catch (e) {
                console.warn('Navigation to list bookings failed:', e);
            }
        }
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
        <View style={[
            isFull ? styles.fullContainer : styles.bottomSheet,
            {
                backgroundColor: theme.colors.primaryBackground,
                borderColor: isFull ? 'transparent' : theme.colors.border,
                borderWidth: isFull ? 0 : 1
            }
        ]}>
            {/* Tabs Container */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.tabBarScroll, isFull && { paddingHorizontal: 20 }]}
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
                                {isFull ? tab : tab.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Section Header */}
            <View style={[styles.sectionHeader, isFull && { paddingHorizontal: 20 }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Jadwal Kamu</Text>
                {!isFull && (
                    <TouchableOpacity style={styles.viewAll} onPress={handleViewAll}>
                        <Text style={[styles.viewAllText, { color: theme.colors.secondary }]}>View all</Text>
                        <IconArrowRight width={14} height={14} fill={theme.colors.secondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Schedule List Container */}
            <View style={[styles.scheduleListContainer, isFull && { paddingHorizontal: 20 }]}>
                {loading ? (
                    <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={theme.colors.secondary} />
                        <Text style={[styles.emptyState, { color: theme.colors.textSecondary, marginTop: 8 }]}>
                            Memuat jadwal...
                        </Text>
                    </View>
                ) : filteredSchedules.length > 0 ? (
                    (isFull ? filteredSchedules : filteredSchedules.slice(0, 1)).map((schedule) => (
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
