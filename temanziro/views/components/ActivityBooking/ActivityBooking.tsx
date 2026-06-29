import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";

import styles from "./ActivityBooking.style";

// Asumsi gambar dipindah ke folder assets/image/
const activities = [
  { id: "1", title: "Nongkrong", vibes: "Cafe & Chill", image: require("@/assets/image/nongkrong.jpg") },
  { id: "2", title: "Olahraga", vibes: "Sports & Active", image: require("@/assets/image/olahraga.jpg") },
  { id: "3", title: "Belajar", vibes: "Study & Work", image: require("@/assets/image/belajar.jpg") },
  { id: "4", title: "Jalan-jalan", vibes: "Explore & Travel", image: require("@/assets/image/jalan.jpg") },
  { id: "5", title: "Hiburan", vibes: "Film & Events", image: require("@/assets/image/hiburan.jpg") },
  { id: "5", title: "Kuliner", vibes: "Food & Dining", image: require("@/assets/image/kuliner.jpg") },
];

export default function ActivityGrid() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.grid}>
      {activities.map((act) => (
        <TouchableOpacity 
          key={act.id} 
          style={styles.card} 
        //   onPress={() => navigation.navigate("")}
        >
          <ImageBackground source={act.image} style={styles.image} imageStyle={{ borderRadius: 16 }}>
            <View style={[styles.overlay, { backgroundColor: `${theme.colors.primary}66` }]} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{act.title}</Text>
              <Text style={styles.vibes}>{act.vibes}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
}