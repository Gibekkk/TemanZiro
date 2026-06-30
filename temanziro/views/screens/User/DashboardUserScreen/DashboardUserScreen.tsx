import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import ActivityGrid from "@/views/components/ActivityBooking/ActivityBooking";
import MascotImg from "@/assets/image/main1-ziro.svg"; // Gunakan format .png/.jpg untuk Image RN
import MapIcon from "@/assets/icon/map-pin.svg";
import VerificationIcon from "@/assets/icon/verified.svg";
import Verification1Icon from "@/assets/icon/verifiedsafety.svg";
import { useAuth } from "@/controllers/hooks/useAuth";

import styles from "./DashboardUserScreen.style";
import MainLayout from "@/views/layouts/MainLayout/MainLayout";

export default function DashboardUser() {
  const { theme } = useTheme();
  //   const { userProfile, loading, role } = useAuth();

  //   const displayName = role === "companion" ? userProfile?.name_companion : userProfile?.name_user;
  //   const address = role === "companion" ? userProfile?.address_companion : userProfile?.address_user;

  return (
    <MainLayout showHeader={true} useScrollView={true}>
      <View
        style={[styles.headerBody, { backgroundColor: theme.colors.primary }]}
      >
        <View style={{ position: "relative", width: 120, height: 120 }}>
          <MascotImg
            style={{
              position: "absolute",
              bottom: -20,
              alignSelf: "center",
            }}
            width={170}
            height={170}
          />
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
              numberOfLines={1} // 👈 Batasi teks agar hanya menjadi 1 baris saja
              ellipsizeMode="tail"
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
              style={[styles.textHeaderLabel, { color: theme.colors.primary }]}
            >
              Ayo seru-seruan bareng{" "}
              <Text style={{ color: theme.colors.secondary }}>TemanZiro!</Text>
            </Text>
          </View>
        </View>
      </View>
      {/* Cukup isi bagian body saja */}
      <View style={styles.bodyWrapper}>
        <Text style={[styles.textBody, { color: theme.colors.textPrimary }]}>
          Pilih <Text style={{ color: theme.colors.secondary }}>aktivitas</Text>{" "}
          hari ini, yuk!
        </Text>
        <Text style={[styles.textBody1, { color: theme.colors.textSecondary }]}>
          Temukan teman untuk setiap momenmu
        </Text>
        
        <ActivityGrid />

        <View
          style={[
            styles.cardContainer,
            { backgroundColor: theme.colors.primaryBackground, borderColor: theme.colors.border },
          ]}
        >
          {/* Kolom Kiri: Konten Teks */}
          <View style={styles.leftColumn}>
            {/* Row Header: Badge Centang + Judul Kecil */}
            <View style={styles.badgeRow}>
              <VerificationIcon
                width={16}
                height={16}
                fill={theme.colors.secondary}
              />
              <Text
                style={[styles.badgeText, { color: theme.colors.secondary }]}
              >
                TemanZiro Promise
              </Text>
            </View>

            {/* Judul Utama */}
            <Text style={[styles.mainTitle, { color: theme.colors.primary }]}>
              Aman, Nyaman, & Positif
            </Text>

            {/* Deskripsi */}
            <Text
              style={[
                styles.description,
                { color: theme.colors.textSecondary },
              ]}
            >
              Komunitas terverifikasi untuk pengalaman berteman yang aman dan
              bermakna.
            </Text>
          </View>

          {/* Kolom Kanan: Gambar Maskot / Perisai Besar */}
          <View style={[styles.rightColumn, {backgroundColor: `${theme.colors.secondaryBackground}60`}]}>
            <Verification1Icon width={30} height={30} />
          </View>
        </View>
      </View>
    </MainLayout>
  );
}
