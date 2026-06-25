import { SplashScreen, Stack, useRouter } from "expo-router";
import { Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Quicksand_400Regular, Quicksand_700Bold, useFonts } from "@expo-google-fonts/quicksand";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [lottieFinished, setLottieFinished] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();

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
    if (lottieFinished && isFirstLaunch !== null) {
      if (isFirstLaunch) {
        router.replace("/auth/AuthScreen_Call");
      } else {
        // router.replace("/auth/AuthScreen_Call");
      }
    }
  }, [lottieFinished, isFirstLaunch]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  if (!lottieFinished) {
    return (
      <View style={{ flex: 1, backgroundColor: "#121212" }}>
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

  // Layar Utama (Root dari Expo Router)
  return (
    <SafeAreaProvider>
      {/* Stack adalah pengganti <MainLayout />. 
        Ia bertugas merender halaman (seperti onboarding-1.tsx atau login.tsx) 
        tanpa memunculkan header bawaan (headerShown: false).
      */}
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}