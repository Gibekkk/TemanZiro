import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import styles from "./IconLabel.style";
import { useTheme } from "@/controllers/hooks/useTheme";

interface IconLabelProps {
  icon: React.ReactNode;
  label: string;
  // Tambahkan property desc opsional (?)
  desc?: string; 
  style?: StyleProp<ViewStyle>;
  iconcontainerstyle?: StyleProp<ViewStyle>;
}

export default function IconLabel({
  icon,
  label,
  desc, // Destructure desc di sini
  style,
  iconcontainerstyle,
}: IconLabelProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.logoWrapper, style]}>
      <View
        style={[
          styles.container,
          iconcontainerstyle,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        {icon}
      </View>
      
      {/* Container untuk teks agar label dan desc tersusun rapi */}
      <View style={styles.textContainer}>
        {label && label !== "none" && (
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            {label}
          </Text>
        )}
        
        {/* Render desc hanya jika desc diberikan (tidak undefined/kosong) */}
        {desc && (
          <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>
            {desc}
          </Text>
        )}
      </View>
    </View>
  );
}