import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import BackIcon from "@/assets/icon/back.svg"; // Pastikan sudah berupa SVG
import styles from "./SecondaryLayout.style";

interface SecondaryLayoutProps {
  children: ReactNode;
  title: string;
  noShadow?: boolean;
  alignLeft?: boolean;
  rightProfile?: string; // URL gambar profil
  tabsComponent?: ReactNode;
}

export default function SecondaryLayout({
  children,
  title,
  noShadow = false,
  alignLeft = false,
  rightProfile,
  tabsComponent,
}: SecondaryLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    // Mengecek apakah bisa kembali ke halaman sebelumnya
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/"); // Fallback jika tidak ada history
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, noShadow ? styles.noShadow : styles.shadow]}>
        <View
          style={[styles.secondHeader, alignLeft && styles.secondHeaderLeft]}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={16} height={16} />
          </TouchableOpacity>

          <View
            style={[
              styles.contentHeader,
              alignLeft && styles.contentHeaderLeft,
            ]}
          >
            <Text style={[styles.title, alignLeft && styles.titleLeft]}>
              {title}
            </Text>

            {rightProfile && (
              <Image
                source={{ uri: rightProfile }}
                style={styles.profileIcon}
              />
            )}
          </View>
        </View>

        {tabsComponent && (
          <View style={styles.tabsWrapper}>{tabsComponent}</View>
        )}
      </View>

      <ScrollView
        style={styles.contentScreen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
