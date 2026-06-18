import React from "react";
import styles from "./activitycard.module.css";
import IconNongkrong from "@/assets/icon/nongkrong.svg";
import IconJalan from "@/assets/icon/jalanjalan.svg";
import IconBelajar from "@/assets/icon/belajar.svg";
import IconOlahraga from "@/assets/icon/olahraga.svg";
import IconKuliner from "@/assets/icon/culinary.svg"; 
import IconNonton from "@/assets/icon/watching.svg";

const ACTIVITY_DATA = {
  nongkrong: { label: "Nongkrong", icon: IconNongkrong },
  jalan: { label: "Jalan-jalan", icon: IconJalan },
  belajar: { label: "Belajar", icon: IconBelajar },
  olahraga: { label: "Olahraga", icon: IconOlahraga },
  kuliner: { label: "Kuliner", icon: IconKuliner },
  nonton: { label: "Nonton", icon: IconNonton },
} as const;

export type ActivityType = keyof typeof ACTIVITY_DATA;

interface ActivityCardProps {
  type: ActivityType;
}

export default function ActivityCard({ type }: ActivityCardProps) {
  const data = ACTIVITY_DATA[type];

  if (!data) return null;

  return (
    <div className={styles.activityCard}>
      <img src={data.icon} alt={data.label} />
      <span>{data.label}</span>
    </div>
  );
}