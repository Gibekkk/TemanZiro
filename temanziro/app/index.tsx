import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/controllers/hooks/useTheme";

export default function Index() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();
  const { theme } = useTheme();

  // Mengecek status launch dari AsyncStorage
  useEffect(() => {
    async function checkAppLaunch() {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Gagal membaca AsyncStorage:", error);
        setIsFirstLaunch(true);
      }
    }
    checkAppLaunch();
  }, []);

  useEffect(() => {
    if (isFirstLaunch !== null) {
      if (isFirstLaunch) {
        router.replace("/auth/AuthScreen_Call");
      } else {
        router.replace("/(tabs)/(dashboard)/dashboard");
      }
    }
  }, [isFirstLaunch, router]);

  // Mengembalikan layar kosong dengan warna background utama sementara memproses navigasi
  // (Sangat cepat, nyaris tidak terlihat oleh pengguna)
  return <View style={{ flex: 1, backgroundColor: theme.colors.primaryBackground }} />;
}