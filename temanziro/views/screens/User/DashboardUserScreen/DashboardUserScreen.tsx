import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import UserProfile from "@/views/components/UI/UserProfile/UserProfile";
import MoneyButton from "@/views/components/UI/MoneyButton/MoneyButton";
import ActivityGrid from "@/views/components/ActivityBooking/ActivityBooking";
import MascotImg from "@/assets/image/main-ziro.svg"; // Gunakan format .png/.jpg untuk Image RN
import MapIcon from "@/assets/icon/map-pin.svg";
import { useAuth } from "@/controllers/hooks/useAuth";

import styles from "./DashboardUserScreen.style";

export default function DashboardUser() {
  const { theme } = useTheme();
  //   const { userProfile, loading, role } = useAuth();

  //   const displayName = role === "companion" ? userProfile?.name_companion : userProfile?.name_user;
  //   const address = role === "companion" ? userProfile?.address_companion : userProfile?.address_user;

  return (
    <ScrollView
      style={[
        styles.dashboard,
        { backgroundColor: theme.colors.primaryBackground },
      ]}
    >
      <View
        style={[
          styles.headerWrapper,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        <View style={styles.headerTop}>
          <Text style={styles.brandTitle}>
            Teman<Text style={{ color: theme.colors.secondary }}>Ziro</Text>
          </Text>
          <View style={styles.userProfileWrapper}>
            <MoneyButton />
            <UserProfile />
          </View>
        </View>

        <View style={styles.headerBody}>
          <View style={styles.mascotImage}>
            <MascotImg width={18} height={18} />
          </View>
          <View
            style={[
              styles.textHeaderWrapper,
              { backgroundColor: theme.colors.lightText },
            ]}
          >
            <Text
              style={[styles.textHeader, { color: theme.colors.textPrimary }]}
            >
              Hi, Alvin
              {/* Hi, {loading ? "Loading..." : displayName || "Teman Ziro"}! */}
            </Text>
            <View style={styles.location}>
              <MapIcon width={18} height={18} />
              <Text
                style={[
                  styles.textSubheader,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Makassar, Sulawesi Selatan
                {/* {loading ? "..." : address || "Lokasi belum tersedia"} */}
              </Text>
            </View>
            <View
              style={[
                styles.boxHeader,
                { backgroundColor: theme.colors.lightText },
              ]}
            >
              <Text
                style={[
                  styles.textHeaderLabel,
                  { color: theme.colors.primary },
                ]}
              >
                Ayo seru-seruan bareng{" "}
                <Text style={{ color: theme.colors.secondary }}>
                  TemanZiro!
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bodyWrapper}>
        <Text style={[styles.textBody, { color: theme.colors.textPrimary }]}>
          Pilih <Text style={{ color: theme.colors.secondary }}>aktivitas</Text>{" "}
          hari ini, yuk!
        </Text>
        <ActivityGrid />
      </View>
    </ScrollView>
  );
}
