import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";

import IconMinat from "@/assets/icon/minat.svg";
import IconPreferences from "@/assets/icon/preferences.svg";
import IconDate from "@/assets/icon/date.svg";
import { BookingData } from "@/views/screens/User/MatchRequestScreen/MatchRequestScreen"; // Sesuaikan lokasi import interface kamu

import styles from "./SummaryList.style";

interface RequestSummaryListProps {
  loading: boolean;
  bookingData: BookingData | null;
}

export default function RequestSummaryList({ loading, bookingData }: RequestSummaryListProps) {
  const { theme } = useTheme();

  const formatDate = (value: any) => {
    if (!value) return "-";
    const date = typeof value?.toDate === "function" ? value.toDate() : value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  if (loading) {
    return <Text style={styles.centerText}>Memuat data...</Text>;
  }

  if (!bookingData) {
    return <Text style={styles.centerText}>Data tidak ditemukan.</Text>;
  }

  return (
    <View style={styles.summaryList}>
      {/* Activity */}
      <View style={styles.summaryItem}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.colors.secondaryBackground }]}>
          <IconMinat width={20} height={20} color={theme.colors.primary} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemLabel, { color: theme.colors.textSecondary }]}>Activity</Text>
          <Text style={[styles.itemValue, { color: theme.colors.textPrimary }]}>{bookingData.activity_name}</Text>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.summaryItem}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.colors.secondaryBackground }]}>
          <IconPreferences width={20} height={20} color={theme.colors.primary} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemLabel, { color: theme.colors.textSecondary }]}>Preferences</Text>
          <View style={styles.pillContainer}>
            {bookingData.preference_companion.length > 0 ? (
              bookingData.preference_companion.map((pref) => (
                <View key={pref} style={[styles.pill, { backgroundColor: "#e0e6ee" }]}>
                  <Text style={[styles.pillText, { color: theme.colors.primary }]}>{pref}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.itemValue, { color: theme.colors.textSecondary }]}>Tidak ada preferensi</Text>
            )}
          </View>
        </View>
      </View>

      {/* Schedule */}
      <View style={styles.summaryItem}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.colors.secondaryBackground }]}>
          <IconDate width={20} height={20} color={theme.colors.primary} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemLabel, { color: theme.colors.textSecondary }]}>Tanggal</Text>
          <Text style={[styles.itemValue, { color: theme.colors.textPrimary }]}>
            {formatDate(bookingData.schedule.start_date)} {" — "} {formatDate(bookingData.schedule.end_date)}
          </Text>
          <Text style={[styles.itemValue, { color: theme.colors.textPrimary, marginTop: 4 }]}>
            {bookingData.schedule.start_time} - {bookingData.schedule.end_time}
          </Text>
        </View>
      </View>
    </View>
  );
}