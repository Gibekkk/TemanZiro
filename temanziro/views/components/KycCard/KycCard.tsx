import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/controllers/hooks/useTheme";
import { VERIFIED_STATUS, VerifiedStatus } from "@/constants/UserDetails";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";
import styles from "./KycCard.style";

interface KycCardProps {
  status: VerifiedStatus;
  onComplete: () => void;
}

export default function KycCard({ status, onComplete }: KycCardProps) {
  const { theme } = useTheme();

  let statusText = "";
  let badgeBgColor = "";
  let badgeTextColor = "";
  let showArrow = false;

  if (status === VERIFIED_STATUS.VERIFIED) {
    statusText = "Terverifikasi";
    badgeBgColor = "rgba(16, 185, 129, 0.1)";
    badgeTextColor = "#10b981"; 
    showArrow = false;
  } else if (status === VERIFIED_STATUS.PENDING) {
    statusText = "Sedang Diproses";
    badgeBgColor = "rgba(233, 97, 0, 0.1)"; 
    badgeTextColor = "#e96100";
    showArrow = false;
  } else {
    statusText = "Belum Verifikasi";
    badgeBgColor = "rgba(225, 29, 72, 0.1)";
    badgeTextColor = "#e11d48";
    showArrow = true;
  }

  const isClickable = status === VERIFIED_STATUS.UNVERIFIED;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={isClickable ? onComplete : undefined}
      activeOpacity={isClickable ? 0.7 : 1}
      disabled={!isClickable}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          <Feather name="shield" size={18} color="#0088CC" />
        </View>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Verifikasi KYC
        </Text>
      </View>

      <View style={styles.rightSection}>
        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {statusText}
          </Text>
        </View>
        {showArrow && (
          <IconAngleRight width={20} height={20} style={styles.arrowIcon} />
        )}
      </View>
    </TouchableOpacity>
  );
}
