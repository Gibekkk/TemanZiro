import EditProfileCompanion from "@/views/screens/Companion/EditProfileCompanion/EditProfileCompanion";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ProfileIndex() {
  return (
    <SafeAreaProvider>
      <EditProfileCompanion />
    </SafeAreaProvider>
  );
}
