import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import IconPendapatan from "@/assets/icon/pendapatan.svg";
import styles from "./IncomeCard.style";

interface IncomeCardProps {
  amount?: string | number;
  style?: StyleProp<ViewStyle>;
}

export default function IncomeCard({ amount = "Rp. 12.000", style }: IncomeCardProps) {
  const { theme, isDark } = useTheme();

  const cardBg = isDark ? "#1a1613" : "#f8efea";
  const cardBorder = isDark ? "#382920" : "#f0dfd7";
  const titleColor = theme.colors.textPrimary;
  const amountColor = theme.colors.secondary;

  const displayAmount = typeof amount === "number" ? `Rp. ${amount.toLocaleString("id-ID")}` : amount;

  return (
    <View style={[styles.incomeCard, { backgroundColor: cardBg, borderColor: cardBorder }, style]}>
      <View style={styles.iconContainer}>
        <IconPendapatan width={36} height={36} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.titleText, { color: titleColor }]}>Pendapatan</Text>
        <Text style={[styles.amountText, { color: amountColor }]}>{displayAmount}</Text>
      </View>
    </View>
  );
}
