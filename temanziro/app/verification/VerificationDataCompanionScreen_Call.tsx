import React from "react";
import VerificationDataCompanionScreen from "@/views/screens/Companion/VerificationDataCompanionScreen/VerificationDataCompanionScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function SelfieKTPRoute() {
  return (
    <SafeAreaProvider>
      <VerificationDataCompanionScreen />
    </SafeAreaProvider>
  );
}
