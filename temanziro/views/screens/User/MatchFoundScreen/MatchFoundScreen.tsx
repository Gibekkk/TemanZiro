import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/controllers/hooks/useTheme";

import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";

import IconCoffe from "@/assets/icon/coffe.svg";
import IconVerified from "@/assets/icon/verified.svg";
import IconHandshake from "@/assets/icon/handshake.svg";
import IconLocation from "@/assets/icon/location.svg";

import styles from "./MatchFoundScreen.style";

export default function MatchFoundScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [companionData] = useState({
    id: "1",
    name_companion: "Sarah",
    age_companion: 24,
    url_photoprofile_companion: "https://i.pravatar.cc/400?img=47",
    preference_companion: ["Ramah", "Asik", "Pendengar Baik"],
  });

  const [bookingData] = useState({
    activity_name: "Nongkrong",
    location: "Cafe Senopati, Jakarta Selatan",
  });

  const handleViewProfile = () => {
    router.push({
      pathname: "/companion-profile",
      params: { companionId: companionData.id },
    });
  };

  const handleBackToHome = () => {
    router.replace("/dashboard");
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: theme.colors.primaryBackground },
      ]}
    >
      <SecondaryLayout
        title="Companion Ditemukan!"
        alignLeft={true}
        titleStyle={{ fontWeight: "bold" }}
      >
        <View style={styles.profileCard}>
          {/* --- Image Section --- */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: companionData.url_photoprofile_companion }}
              style={styles.profileImage}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0.4 }}
              style={styles.bgGradient}
            />
            <View style={styles.verifiedBadge}>
              <IconVerified width={14} height={14} />
              <Text style={styles.verifiedText}>VERIFIED COMPANION</Text>
            </View>
          </View>

          {/* --- Card Body --- */}
          <View style={styles.cardBody}>
            {/* --- Header Row --- */}
            <View style={styles.headerRow}>
              <View style={styles.nameColumn}>
                <Text
                  style={[styles.name, { color: theme.colors.textPrimary }]}
                >
                  {companionData.name_companion}, {companionData.age_companion}
                </Text>
                <View style={styles.matchType}>
                  <IconCoffe
                    width={16}
                    height={16}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.matchTypeText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {bookingData.activity_name} Match
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: `${theme.colors.primary}15` },
                ]}
                activeOpacity={0.7}
              >
                <IconHandshake
                  width={24}
                  height={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* --- Proposed Activity --- */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                PROPOSED ACTIVITY
              </Text>
              <View
                style={[
                  styles.activityBox,
                  {
                    backgroundColor: theme.colors.primaryBackground,
                    borderColor: `${theme.colors.primary}15`,
                  },
                ]}
              >
                <View style={styles.iconWrapper}>
                  <IconLocation
                    width={20}
                    height={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.activityDetails}>
                  <Text
                    style={[
                      styles.activityName,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    {bookingData.activity_name}
                  </Text>
                  <Text
                    style={[
                      styles.activityLocation,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {bookingData.location}
                  </Text>
                </View>
              </View>
            </View>

            {/* --- Key Vibes --- */}
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              KEY VIBES
            </Text>
            <View style={styles.vibesContainer}>
              {companionData.preference_companion.length > 0 ? (
                companionData.preference_companion
                  .slice(0, 3)
                  .map((vibe, index) => (
                    <View
                      key={index}
                      style={[
                        styles.vibePill,
                        {
                          backgroundColor: `${theme.colors.primary}15`,
                          borderColor: `${theme.colors.primary}30`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.vibePillText,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {vibe}
                      </Text>
                    </View>
                  ))
              ) : (
                <View
                  style={[
                    styles.vibePill,
                    { backgroundColor: theme.colors.secondaryBackground },
                  ]}
                >
                  <Text
                    style={[
                      styles.vibePillText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    No vibes available
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* --- Action Buttons --- */}
        <GeneralButton
          variant="primary"
          style={styles.buttonProfile}
          onClick={handleViewProfile}
        >
          Lihat Profil
        </GeneralButton>

        <GeneralButton
          variant="ghost"
          style={styles.buttonHome}
          onClick={handleBackToHome}
        >
          Kembali ke home
        </GeneralButton>
      </SecondaryLayout>
    </View>
  );
}
