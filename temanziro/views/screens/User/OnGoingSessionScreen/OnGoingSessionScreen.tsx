import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/controllers/hooks/useTheme";

import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import CheckInAction from "@/views/components/CheckInButton/CheckInButton";

import IconLocation from "@/assets/icon/location.svg";
import IconChat from "@/assets/icon/chatorange.svg";
import IconStar from "@/assets/icon/starreview.svg";

import styles from "./OnGoingSessionScreen.style";

export default function DetailDayScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [countdown] = useState({ hours: "02", minutes: "45", seconds: "30" });
  const [isToday] = useState(true);

  const [bookingData] = useState({
    id: "B-12345",
    status: "Dikonfirmasi",
    locationText: "Central Park Mall",
    startTime: "Starts at 16:00",
  });

  const [companionData] = useState({
    name: "Sarah",
    avatar: "https://i.pravatar.cc/150?img=47",
    tag: "PENDENGAR BAIK",
    rating: "4.8",
  });

  const handleOpenChat = () => {
    router.push("/common/chatscreen");
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: theme.colors.primaryBackground },
      ]}
    >
      <SecondaryLayout title="Sesi Mendatang" alignLeft={true} noShadow={true} rightProfile="https://i.pravatar.cc/150?img=5">
        {/* --- TIMER SECTION --- */}
        <View style={styles.timerSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            MULAI DARI
          </Text>
          <View style={styles.timerGrid}>
            <View style={styles.timerBox}>
              <View
                style={[
                  styles.number,
                  {
                    backgroundColor: `${theme.colors.primary}15`,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.timeNum, { color: theme.colors.primary }]}>
                  {countdown.hours}
                </Text>
              </View>
              <Text
                style={[
                  styles.timeLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                JAM
              </Text>
            </View>
            <View style={styles.timerBox}>
              <View
                style={[
                  styles.number,
                  {
                    backgroundColor: `${theme.colors.primary}15`,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.timeNum, { color: theme.colors.primary }]}>
                  {countdown.minutes}
                </Text>
              </View>
              <Text
                style={[
                  styles.timeLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                MENIT
              </Text>
            </View>
            <View style={styles.timerBox}>
              <View
                style={[
                  styles.number,
                  {
                    backgroundColor: `${theme.colors.primary}15`,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.timeNum, { color: theme.colors.primary }]}>
                  {countdown.seconds}
                </Text>
              </View>
              <Text
                style={[
                  styles.timeLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                DETIK
              </Text>
            </View>
          </View>
        </View>

        {/* --- SESSION STATUS CARD --- */}
        <View
          style={[
            styles.card,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.primaryBackground,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text
              style={[styles.cardLabel, { color: theme.colors.textSecondary }]}
            >
              STATUS SESI
            </Text>
            <View
              style={[
                styles.tagTodayContainer,
                { backgroundColor: `${theme.colors.primary}15` },
              ]}
            >
              <Text
                style={[styles.tagTodayText, { color: theme.colors.primary }]}
              >
                {isToday ? "Hari ini" : "Terjadwal"}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.dotGreen} />
            <Text
              style={[styles.statusText, { color: theme.colors.textPrimary }]}
            >
              {bookingData.status}
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <View style={styles.locationRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.secondaryBackground },
              ]}
            >
              <IconLocation
                width={20}
                height={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.locationInfo}>
              <Text
                style={[
                  styles.cardLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                LOKASI MEETUP
              </Text>
              <Text
                style={[
                  styles.locationTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {bookingData.locationText}
              </Text>
              <Text
                style={[
                  styles.locationSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {bookingData.startTime}
              </Text>
            </View>
          </View>
        </View>

        {/* --- COMPANION CARD --- */}
        <View
          style={[
            styles.card,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.primaryBackground,
            },
          ]}
        >
          <View style={styles.companionRow}>
            <Image
              source={{ uri: companionData.avatar }}
              style={[styles.avatar, { borderColor: theme.colors.primary }]}
            />
            <View style={styles.companionInfo}>
              <Text
                style={[
                  styles.cardLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                YOUR COMPANION
              </Text>
              <Text
                style={[
                  styles.companionName,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {companionData.name}
              </Text>

              <View style={styles.tagsRow}>
                <View
                  style={[
                    styles.tagListenerContainer,
                    { backgroundColor: `${theme.colors.primary}15` },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagListenerText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {companionData.tag}
                  </Text>
                </View>
                <View style={styles.ratingRow}>
                  <IconStar width={12} height={12} />
                  <Text
                    style={[styles.ratingText, { color: theme.colors.primary }]}
                  >
                    {companionData.rating}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* --- ACTION BUTTONS --- */}
        <View style={styles.actionArea}>
          <CheckInAction bookingId={bookingData.id} />
        </View>

        <GeneralButton
          variant="ghost"
          style={[styles.chatButton, { borderColor: theme.colors.primary }]}
          textStyle={{ color: theme.colors.primary }}
          onClick={handleOpenChat}
          shadow="none"
        >
          <View style={styles.btnContentRow}>
            <IconChat width={20} height={20} color={theme.colors.primary} />
            <Text
              style={[styles.chatButtonText, { color: theme.colors.primary }]}
            >
              Open Chat
            </Text>
          </View>
        </GeneralButton>

        {/* --- MAP SECTION --- */}
        <View
          style={[
            styles.mapWrapper,
            {
              borderColor: theme.colors.primaryBackground,
              backgroundColor: theme.colors.secondaryBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.mapPlaceholderText,
              { color: theme.colors.textSecondary },
            ]}
          >
            Peta Lokasi Tersedia
          </Text>
        </View>
      </SecondaryLayout>
    </View>
  );
}
