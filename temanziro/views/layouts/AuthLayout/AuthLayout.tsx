import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import IconThreePeople from "@/assets/icon/icon-threepeople.svg";
import styles from "./AuthLayout.style";
import { useTheme } from "@/controllers/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: theme.colors.primaryBackground,
          paddingTop: insets.top > 0 ? 15 : 15,
        },
      ]}
    >
      {/* Tambahkan padding atas dinamis di header berdasarkan insets */}
      <View style={[styles.header, { paddingTop: insets.top || 20 }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Teman<Text style={styles.titleHighlight}>Ziro</Text>
        </Text>

        <View style={[styles.tag, { backgroundColor: theme.colors.primary }]}>
          <IconThreePeople width={18} height={18} />
          <Text style={[styles.tagText, {color: theme.colors.lightText}]}>KOMUNITAS DIUTAMAKAN</Text>
        </View>
      </View>

      <View
        style={[
          styles.container,
          {
            paddingBottom: (insets.bottom || 20) + 20,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}
