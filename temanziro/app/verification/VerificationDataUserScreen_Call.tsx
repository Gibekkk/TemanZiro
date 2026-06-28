import React from "react";
import VerificationDataUserScreen from "@/views/screens/User/VerificationDataUserScreen/VerificationDataUserScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function SelfieKTPRoute() {
  return (
    <SafeAreaProvider>
      <VerificationDataUserScreen />
    </SafeAreaProvider>
  );
}
