import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconThreePeople from "@/assets/icon/icon-threepeople.svg";
import styles from "./AuthLayout.style";
import { COMMON_COLORS } from "@/constants/Theme"; 

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const primaryLight = `${COMMON_COLORS.primary}D9`; 

  return (
    <LinearGradient
      colors={[primaryLight, COMMON_COLORS.background]}
      locations={[0.25, 0.7]}
      style={styles.screen}
    >
      <Text style={styles.title}>
        Teman<Text style={styles.titleHighlight}>Ziro</Text>
      </Text>
      
      <View style={styles.container}>
        <View style={styles.tag}>
          <IconThreePeople width={16} height={16} />
          <Text style={styles.tagText}>KOMUNITAS DIUTAMAKAN</Text>
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </LinearGradient>
  );
}