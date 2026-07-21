import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/controllers/hooks/useTheme";

import IconCoffe1 from "@/assets/icon/coffe1.svg";
import IconCoffe2 from "@/assets/icon/coffe2.svg";
import IconCoffe3 from "@/assets/icon/coffe3.svg";

import styles from "./AnimatedGraphicBanner.style";

const ICOFFE_DATA = [
  {
    id: "1",
    Component: IconCoffe1,
    customStyle: { transform: [{ translateY: -2.6 }, { translateX: 3.8 }] },
  },
  {
    id: "2",
    Component: IconCoffe2,
    customStyle: { transform: [{ translateY: -2.6 }, { translateX: 3.8 }] },
  },
  {
    id: "3",
    Component: IconCoffe3,
    customStyle: { transform: [{ translateY: -2.6 }, { translateX: 3.8 }] },
  },
];

export default function AnimatedGraphicBanner() {
  const { theme } = useTheme();

  const [activeIndex, setActiveIndex] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  // Animasi Auto-Scroll
  useEffect(() => {
    // Kembalikan nilai ke 0 (kiri) sebelum mulai
    animValue.setValue(0);

    Animated.sequence([
      // A. Ikon masuk dari kiri ke tengah (Opacity menebal)
      Animated.timing(animValue, {
        toValue: 1,
        duration: 600, // Kecepatan masuk
        useNativeDriver: true, // 👈 INI KUNCI AGAR SEHALUS CSS
      }),
      // B. Ikon bertahan / diam di tengah
      Animated.delay(1200),
      // C. Ikon keluar ke kanan (Opacity menipis)
      Animated.timing(animValue, {
        toValue: 2,
        duration: 600, // Kecepatan keluar
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Ganti ke ikon berikutnya setelah animasi 1 siklus selesai
      setActiveIndex((prev) => (prev + 1) % ICOFFE_DATA.length);
    });
  }, [activeIndex, animValue]);

  // Animasi Loading Dots
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  const translateX = animValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-60, 0, 60],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  const ActiveIcon = ICOFFE_DATA[activeIndex].Component;
  const activeCustomStyle = ICOFFE_DATA[activeIndex].customStyle;

  return (
    <LinearGradient
      colors={[
        `${theme.colors.secondary}50`,
        `${theme.colors.secondaryBackground}10`,
      ]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={[styles.graphicBanner, { borderColor: `${theme.colors.secondary}30` }]}
    >
      <View
        style={[
          styles.circleBackground,
          { backgroundColor: `${theme.colors.secondary}30` },
        ]}
      >
        <Animated.View
          style={[
            styles.iconSlideContainer,
            {
              opacity,
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={[styles.iconWrapperContent, activeCustomStyle]}>
            <ActiveIcon width={55} height={55} />
          </View>
        </Animated.View>
      </View>

      <Animated.View
        style={[styles.loadingDotsContainer, { opacity: fadeAnim }]}
      >
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
      </Animated.View>
    </LinearGradient>
  );
}
