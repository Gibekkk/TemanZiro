import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();

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
      <View style={[
        styles.header,
        noShadow ? styles.noShadow : styles.shadow,
        { paddingTop: insets.top > 0 ? insets.top : 20 }
      ]}>
        <View style={[styles.secondHeader, alignLeft && styles.secondHeaderLeft]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={16} height={16} />
          </TouchableOpacity>

          <View style={[styles.contentHeader, alignLeft && styles.contentHeaderLeft]}>
            <Text style={[styles.title, alignLeft && styles.titleLeft]}>{title}</Text>

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

      <View style={[styles.contentScreen, { paddingBottom: insets.bottom || 20 }]}>
        {children}
      </View>
    </View>
  );
}