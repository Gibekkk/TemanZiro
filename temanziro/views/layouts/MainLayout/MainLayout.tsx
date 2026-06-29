import React, { ReactNode } from "react";
import { View, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/controllers/hooks/useTheme"; // Pastikan path ini benar
import styles from "./MainLayout.style"; // Pastikan style header sudah pindah ke sini
import MoneyButton from "@/views/components/UI/MoneyButton/MoneyButton";
import UserProfile from "@/views/components/UI/UserProfile/UserProfile";

interface MainLayoutProps {
  children: ReactNode;
  useScrollView?: boolean;
  showHeader?: boolean; // Props baru untuk toggle header
}

export default function MainLayout({
  children,
  useScrollView = true,
  showHeader = false,
}: MainLayoutProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const contentStyle = [
    styles.screen,
    {
      paddingTop: insets.top > 0 ? (showHeader ? 0 : insets.top + 10) : 20,
      paddingBottom: insets.bottom || 20,
    },
  ];

  // Komponen Header Tetap
  const HeaderComponent = (
    <View
      style={[styles.headerWrapper, {  }]}
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
    </View>
  );

  if (useScrollView) {
    return (
      <View style={styles.container}>
        {showHeader && HeaderComponent}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentStyle}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, contentStyle]}>
      {showHeader && HeaderComponent}
      {children}
    </View>
  );
}
