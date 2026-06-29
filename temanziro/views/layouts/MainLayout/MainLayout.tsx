import React, { ReactNode } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./MainLayout.style";

interface MainLayoutProps {
  children: ReactNode;
  useScrollView?: boolean;
}

export default function MainLayout({ children, useScrollView = true }: MainLayoutProps) {
  const insets = useSafeAreaInsets();

  const contentStyle = [
    styles.screen,
    {
      paddingTop: insets.top > 0 ? insets.top + 10 : 20,
      paddingBottom: insets.bottom || 20,
    },
  ];

  if (useScrollView) {
    return (
      <View style={styles.container}>
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
      {children}
    </View>
  );
}
