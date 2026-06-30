import ProfileCompanion from "@/views/screens/Companion/ProfileCompanion/ProfileCompanion";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ProfileIndex() {
  return (
    <SafeAreaProvider>
      <ProfileCompanion />
    </SafeAreaProvider>
  );
}
