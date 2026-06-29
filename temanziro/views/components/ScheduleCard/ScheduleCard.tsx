import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import IMGMiniZiro from "@/assets/image/img-placeholder.svg";
import styles from "./ScheduleCard.style";

interface LocationData {
  address: string;
}

interface ScheduleData {
  id?: string;
  status: string;
  name: string;
  age: number | string;
  location: string | LocationData;
  date: string;
  time: string;
  badgeText: string;
  avatar: string;
}
export default function ScheduleCard({ schedule, onPress }: { schedule: ScheduleData; onPress?: () => void }) {
  const badgeColor = schedule.status === "batal" ? "#e53e3e" : "#d95d16";
  const locationDisplay = typeof schedule.location === "string"
    ? schedule.location
    : (schedule.location as LocationData)?.address || "Belum ditentukan";
  return (
    <TouchableOpacity
      style={styles.scheduleCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={styles.badgeText}>{schedule.badgeText}</Text>
      </View>
      <View style={styles.avatarSmall}>
        {schedule.avatar ? (
          <Image
            source={{ uri: schedule.avatar }}
            style={styles.avatarSmallImage}
          />
        ) : (
          <View style={[styles.avatarSmallImage, { overflow: "hidden", alignItems: "center", justifyContent: "center" }]}>
            <IMGMiniZiro width={48} height={48} />
          </View>
        )}
      </View>
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleName}>
          {schedule.name}, {schedule.age}
        </Text>
        <Text style={styles.infoRow} numberOfLines={1}>
          📍 {locationDisplay}
        </Text>
        <View style={styles.dateTimeRow}>
          <Text style={styles.infoText}>📅 {schedule.date}</Text>
          <Text style={[styles.infoText, { marginLeft: 12 }]}>🕒 {schedule.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
