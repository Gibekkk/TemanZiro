import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";

// 1. Import semua icon yang dibutuhkan (sesuaikan path dan nama file kamu)
import IconNongkrong from "@/assets/icon/nongkrongorange.svg";
import IconOlahraga from "@/assets/icon/olahragaorange.svg";
import IconBelajar from "@/assets/icon/belajarorange.svg";
import IconJalan from "@/assets/icon/belanjaorange.svg";
import IconHiburan from "@/assets/icon/hiburanorange.svg";
import IconKuliner from "@/assets/icon/kulinerorange.svg";

import styles from "./ActivityBooking.style";

// 2. Tambahkan properti 'Icon' ke dalam array dengan value komponen icon-nya
const activities = [
  { id: "1", title: "Nongkrong", vibes: "Cafe & Chill", image: require("@/assets/image/nongkrong.jpg"), Icon: IconNongkrong },
  { id: "2", title: "Olahraga", vibes: "Sports & Active", image: require("@/assets/image/olahraga.jpg"), Icon: IconOlahraga },
  { id: "3", title: "Belajar", vibes: "Study & Work", image: require("@/assets/image/belajar.jpg"), Icon: IconBelajar },
  { id: "4", title: "Jalan-jalan", vibes: "Explore & Travel", image: require("@/assets/image/jalan.jpg"), Icon: IconJalan },
  { id: "5", title: "Hiburan", vibes: "Film & Events", image: require("@/assets/image/hiburan.jpg"), Icon: IconHiburan },
  { id: "6", title: "Kuliner", vibes: "Food & Dining", image: require("@/assets/image/kuliner.jpg"), Icon: IconKuliner },
];

export default function ActivityGrid() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.grid}>
      {activities.map((act) => {
        // Simpan referensi komponen ke variabel dengan huruf kapital
        // agar bisa di-render sebagai JSX tag
        const ActivityIcon = act.Icon;

        return (
          <TouchableOpacity 
            key={act.id} 
            style={styles.card} 
            // onPress={() => navigation.navigate("")}
          >
            <ImageBackground source={act.image} style={styles.image} imageStyle={{ borderRadius: 16 }}>
              <View style={[styles.overlay, { backgroundColor: `${theme.colors.primary}66` }]} />
              
              <View style={{backgroundColor: `${theme.colors.primaryBackground}`, marginLeft: 20, padding: 12, borderRadius:30 }}>
                // 3. Render icon secara dinamis
                <ActivityIcon width={24} height={24} /> 
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>{act.title}</Text>
                <Text style={styles.vibes}>{act.vibes}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}