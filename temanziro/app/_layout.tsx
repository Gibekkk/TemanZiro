import { SplashScreen } from "expo-router";

import { Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Quicksand_400Regular, Quicksand_700Bold, useFonts } from "@expo-google-fonts/quicksand";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [lottieFinished, setLottieFinished] = React.useState(false);
  const [fontsLoaded, fontsError] = useFonts({
    'Quicksand_400Regular': Quicksand_400Regular,
    'Quicksand_700Bold': Quicksand_700Bold,
    'Montserrat_400Regular': Montserrat_400Regular,
    'Montserrat_700Bold': Montserrat_700Bold,
  })

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

  if (!lottieFinished) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212' }}> 
        <LottieView
          source={require('@/assets/animation/TemanZiro_LoadingScreen.json')}
          autoPlay
          loop={false}
          onAnimationFinish={() => setLottieFinished(true)}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* <MainLayout /> */}
    </SafeAreaProvider>
  );
}

function MainLayout() {
}