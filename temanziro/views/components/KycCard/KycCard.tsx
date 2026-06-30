import React from "react";
import { View, Text } from "react-native";
import styles from "./KycCard.style";
import IconKTP from "@/assets/icon/icon-verified-non.svg";
import IconPendKTP from "@/assets/icon/icon-verification-pend.svg";
import Button from "@/views/components/GeneralButton/GeneralButton";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { useTheme } from "@/controllers/hooks/useTheme";
import { VERIFIED_STATUS, VerifiedStatus } from "@/constants/UserDetails";
import { COMMON_COLORS } from "@/constants/Theme";

interface KycCardProps {
  status: VerifiedStatus;
  onComplete: () => void;
}

export default function KycCard({ status, onComplete }: KycCardProps) {
  const { isComplete, isVerified } = useUserProfile();
  const { theme, isDark } = useTheme();

  if (isComplete && isVerified) {
    return null;
  }

  const isPending = status === VERIFIED_STATUS.PENDING;
  const Icon = isPending ? IconPendKTP : IconKTP;

  const cardBg = isDark ? "#1e1b18" : COMMON_COLORS.tertiaryBackground;
  const cardBorder = isDark ? "#3c2c22" : COMMON_COLORS.border;

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon width={24} height={24} />
        </View>

        <View style={styles.textContainer}>
          {isPending ? (
            <>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                Data kamu sedang diproses
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Mohon tunggu, admin sedang memverifikasi datamu.
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                Jangan lupa verifikasi datamu
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Agar bisa cari teman jalan kamu.
              </Text>
            </>
          )}
        </View>
      </View>

      {status === VERIFIED_STATUS.UNVERIFIED && !isComplete && (
        <View style={styles.action}>
          <Button
            variant="primary"
            shadow="none"
            style={styles.button}
            textStyle={styles.buttonText}
            onClick={onComplete}
          >
            Lengkapi
          </Button>
        </View>
      )}
    </View>
  );
}
