import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import IMGMiniZiro from "@/assets/image/img-placeholder.svg";
import styles from "./ScheduleCard.style";
import IconLocation from '@/assets/icon/location-primary.svg';
import IconDate from '@/assets/icon/date-primary.svg';
import IconTime from '@/assets/icon/time-primary.svg';
import { useTheme } from "@/controllers/hooks/useTheme";

interface LocationData {
  address: string;
}

interface ScheduleData {
  id?: string;
  name: string;
  age: number | string;
  location: string | LocationData;
  date: string;
  time: string;
  isOnline: boolean;
  avatar?: string;
  bookingUid: string;
}
const formatName = (fullName: string): string => {
  if (!fullName) return "";
  const words = fullName.trim().split(/\s+/);
  if (words.length > 2) {
    return `${words[0]} ${words[words.length - 1]}`;
  }
  return fullName;
};

export default function ScheduleCard({ schedule, onPress }: { schedule: ScheduleData; onPress?: () => void }) {
  const locationDisplay = typeof schedule.location === "string"
    ? schedule.location
    : (schedule.location as LocationData)?.address || "Belum ditentukan";

  const { theme, isDark } = useTheme();

  const cardBg = isDark ? "#1a1613" : "#f8efea";
  const cardBorder = isDark ? "#382920" : "#f0dfd7";

  return (
    <TouchableOpacity
      style={[styles.scheduleCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
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
        {schedule.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleName}>
          {formatName(schedule.name)}, {schedule.age}
        </Text>
        <View style={styles.infoContainer}>
            <IconLocation width={12} height={12} />
            <Text style={styles.infoText}>{locationDisplay}</Text>
        </View>
       <View style={styles.dateTimeRow}>
          <View style={styles.infoContainer}>
            <IconDate width={12} height={12} />
            <Text style={styles.infoText}>{schedule.date}</Text>
          </View>
          <View style={[styles.infoContainer, { marginLeft: 12 }]}>
            <IconTime width={12} height={12} />
            <Text style={styles.infoText}>{schedule.time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
