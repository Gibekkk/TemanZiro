import React, { ReactNode } from "react";
import { View, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/controllers/hooks/useTheme"; // Pastikan path ini benar
import styles from "./MainLayout.style"; // Pastikan style header sudah pindah ke sini
import MoneyButton from "@/views/components/UI/MoneyButton/MoneyButton";
import UserProfile from "@/views/components/UI/UserProfile/UserProfile";
import NotificationBell from "@/views/components/NotificationBell/NotificationBell";

interface MainLayoutProps {
  children: ReactNode;
  useScrollView?: boolean;
  showHeader?: boolean; // Props baru untuk toggle header
  isDashboard?: boolean;
}

export default function MainLayout({
  children,
  useScrollView = true,
  showHeader = false,
  isDashboard = true,
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
      style={[
        styles.headerWrapper,
        {
          backgroundColor: isDashboard ? theme.colors.tertiaryBackground : "transparent",
          paddingTop: insets.top > 0 ? insets.top + 12 : 12,
          paddingBottom: 8,
        }
      ]}
    >
      <View style={styles.headerTop}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.colors.secondary }}>
          Teman Ziro
        </Text>
        <View style={styles.userProfileWrapper}>
          <MoneyButton />
          <NotificationBell />
          <UserProfile />
        </View>
      </View>
    </View>
  );

  if (useScrollView) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.tertiaryBackground }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentStyle}
          style={{ backgroundColor: theme.colors.tertiaryBackground }}
        >
          {showHeader && HeaderComponent}
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, contentStyle, { backgroundColor: theme.colors.tertiaryBackground }]}>
      {showHeader && HeaderComponent}
      {children}
    </View>
  );
}
