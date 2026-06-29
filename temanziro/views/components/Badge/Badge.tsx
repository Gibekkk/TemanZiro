import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./Badge.style";
import { BADGES, BadgeTier } from "@/constants/TierDetails";


interface BadgeProps {
  tier: BadgeTier | string;
  currentProgress?: number;
  maxProgress?: number;
  onRewardsPress?: () => void;
}
const TIER_THEMES: Record<BadgeTier, { cardBg: string; border: string; progressFill: string }> = {
  bronze: { cardBg: "#f8efea", border: "#f0dfd7", progressFill: "#d95d16" },
  silver: { cardBg: "#f1f5f9", border: "#e2e8f0", progressFill: "#64748b" },
  gold: { cardBg: "#fffbeb", border: "#fef3c7", progressFill: "#d97706" },
  platinum: { cardBg: "#f0fdfa", border: "#ccfbf1", progressFill: "#0d9488" },
};
export default function Badge({ tier, currentProgress = 0, maxProgress = 9, onRewardsPress }: BadgeProps) {
  const lowerTier = tier.toLowerCase();
  const activeBadge = BADGES.find((b) => b.id.toLowerCase() === lowerTier) || BADGES[0];
  const activeTier = (activeBadge.id === "silver" || activeBadge.id === "gold" || activeBadge.id === "platinum")
    ? activeBadge.id as BadgeTier
    : "bronze";
  const Medal = activeBadge.medal;
  const tierName = activeBadge.name;
  const theme = TIER_THEMES[activeTier];
  const percentage = maxProgress > 0 ? Math.min((currentProgress / maxProgress) * 100, 100) : 0;
  return (
    <View style={[styles.tierCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
      <View style={styles.tierHeader}>
        <View style={styles.tierInfo}>
          <View style={styles.imgMedali}>
            <Medal width={24} height={24} />
          </View>
          <Text style={styles.tierName}>{tierName}</Text>
        </View>
        <TouchableOpacity onPress={onRewardsPress}>
          <Text style={styles.rewardsLink}>Rewards</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: theme.progressFill }]} />
        </View>
        <Text style={styles.progressText}>{currentProgress} / {maxProgress}</Text>
      </View>
    </View>
  );
}