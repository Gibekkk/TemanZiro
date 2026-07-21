import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";

import IconNongkrong from "@/assets/icon/nongkrong.svg";
import IconJalan from "@/assets/icon/jalanjalan.svg";
import IconBelajar from "@/assets/icon/belajar.svg";
import IconOlahraga from "@/assets/icon/olahraga.svg";
import IconKuliner from "@/assets/icon/culinary.svg";
import IconNonton from "@/assets/icon/watching.svg";

import styles from "./ActivityListCard.style";

const ACTIVITY_DATA = {
  nongkrong: { label: "Nongkrong", Icon: IconNongkrong },
  jalan: { label: "Jalan-jalan", Icon: IconJalan },
  belajar: { label: "Belajar", Icon: IconBelajar },
  olahraga: { label: "Olahraga", Icon: IconOlahraga },
  kuliner: { label: "Kuliner", Icon: IconKuliner },
  nonton: { label: "Nonton", Icon: IconNonton },
} as const;

export type ActivityType = keyof typeof ACTIVITY_DATA;

interface ActivityCardProps {
  type: ActivityType;
}

export default function ActivityCard({ type }: ActivityCardProps) {
  const { theme } = useTheme();
  const data = ACTIVITY_DATA[type];

  if (!data) return null;

  const { Icon, label } = data;

  return (
    <View
      style={[
        styles.activityCard,
        {
          backgroundColor: `${theme.colors.secondaryBackground}40`,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Icon width={24} height={24} color={theme.colors.textPrimary} />
      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
        {label}
      </Text>
    </View>
  );
}