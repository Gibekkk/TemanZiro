import { useFonts } from "@expo-google-fonts/quicksand";
import { Stack } from "expo-router";

import { Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Quicksand_400Regular, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    'Quicksand_400Regular': Quicksand_400Regular,
    'Quicksand_700Bold': Quicksand_700Bold,
    'Montserrat_400Regular': Montserrat_400Regular,
    'Montserrat_700Bold': Montserrat_700Bold,
  })

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded || fontsError) {
        // Kalau ada animasi splashscreen
      }
    }
    prepare();
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }
  return (
    <SafeAreaProvider>
    </SafeAreaProvider>
  );
}

function MainLayout() {
}