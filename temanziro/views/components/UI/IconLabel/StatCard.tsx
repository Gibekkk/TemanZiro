import React from "react";
import { View, Text, StyleProp, ViewStyle, Dimensions } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import styles from "./StatCard.style";

const { width: screenWidth } = Dimensions.get("window");

interface StatCardProps {
  title: string;
  value: string | number;
  IconComponent: React.ComponentType<{ width: number; height: number }>;
  style?: StyleProp<ViewStyle>;
  isCurrency?: boolean;
}

export default function StatCard({
  title,
  value,
  IconComponent,
  style,
  isCurrency = false,
}: StatCardProps) {
  const { theme, isDark } = useTheme();

  const cardBg = isDark ? "#1a1613" : "#f8efea";
  const cardBorder = isDark ? "#382920" : "#f0dfd7";
  const titleColor = theme.colors.textPrimary;
  const valueColor = theme.colors.secondary;

  const formatDisplayValue = (val: string | number, currencyFlag: boolean) => {
    if (typeof val !== "number") return val;

    if (currencyFlag) {
      if (val >= 1_000_000_000) {
        return `Rp. ${(val / 1_000_000_000).toLocaleString("id-ID", {
          maximumFractionDigits: 2,
        })}B`;
      }
      if (val >= 1_000_000) {
        return `Rp. ${(val / 1_000_000).toLocaleString("id-ID", {
          maximumFractionDigits: 2,
        })}M`;
      }
      if (val >= 1_000) {
        return `Rp. ${(val / 1_000).toLocaleString("id-ID", {
          maximumFractionDigits: 1, 
        })}K`;
      }
      return `Rp. ${val.toLocaleString("id-ID")}`;
    }

    return val.toString();
  };

  const displayValue = formatDisplayValue(value, isCurrency);
  const iconSize = screenWidth <= 360 ? 18 : screenWidth <= 410 ? 22 : 28;

  return (
    <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }, style]}>
      <View style={styles.iconContainer}>
        <IconComponent width={iconSize} height={iconSize} />
      </View>
      <View style={styles.textContainer}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={[styles.titleText, { color: titleColor }]}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.valueText, { color: valueColor }]}
        >
          {displayValue}
        </Text>
      </View>
    </View>
  );
}
