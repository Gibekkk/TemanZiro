import { SplashScreen, Stack } from "expo-router";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import {
  Quicksand_400Regular,
  Quicksand_700Bold,
  useFonts,
} from "@expo-google-fonts/quicksand";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import { ThemeProvider } from "@/controllers/context/ThemeContext";
import { AuthProvider } from "@/controllers/context/AuthContext";
import { UserProfileProvider } from "@/controllers/context/UserProfileContext";
import { PresenceProvider } from "@/controllers/context/PresenceContext";

SplashScreen.preventAutoHideAsync();

// 1. Komponen Pembungkus Utama
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <UserProfileProvider>
            <PresenceProvider>
              <RootLayoutContent />
            </PresenceProvider>
          </UserProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// 2. Komponen Isi
function RootLayoutContent() {
  const [lottieFinished, setLottieFinished] = useState(false);
  const { theme } = useTheme();

  const [fontsLoaded, fontsError] = useFonts({
    Quicksand_400Regular: Quicksand_400Regular,
    Quicksand_700Bold: Quicksand_700Bold,
    Montserrat_400Regular: Montserrat_400Regular,
    Montserrat_700Bold: Montserrat_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded || fontsError) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  // Logika Lottie tetap dipertahankan di sini
  if (!lottieFinished) {
    return (
      <View
        style={{ flex: 1, backgroundColor: theme.colors.primaryBackground }}
      >
        <LottieView
          source={require("@/assets/animation/TemanZiro_LoadingScreen.json")}
          autoPlay
          loop={false}
          onAnimationFinish={() => setLottieFinished(true)}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  // Layar Utama (Setelah Lottie selesai, Stack akan me-render app/index.tsx)
  return <Stack screenOptions={{ headerShown: false }} />;
}