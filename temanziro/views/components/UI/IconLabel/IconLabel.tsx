import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import styles from "./IconLabel.style";
import { COMMON_COLORS } from "@/constants/Theme";

// Mengasumsikan icon yang dikirim sudah berupa komponen SVG dari react-native-svg
interface IconLabelProps {
  IconComponent: React.ElementType;
  label: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  iconWidth?: number;
  iconHeight?: number;
  iconcontainerstyle?: StyleProp<ViewStyle>;
}

export default function IconLabel({
  IconComponent,
  label,
  color,
  style,
  iconcontainerstyle,
  iconWidth = 18,
  iconHeight = 18,
}: IconLabelProps) {
  return (
    <View style={[styles.logoWrapper, style]}>
      <View
        style={[
          styles.container,
          color ? { backgroundColor: `${COMMON_COLORS.secondaryBackground}` } : {},
          iconcontainerstyle
        ]}
      >
        <IconComponent width={iconWidth} height={iconHeight} />
      </View>
      {label && label !== "none" && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}
