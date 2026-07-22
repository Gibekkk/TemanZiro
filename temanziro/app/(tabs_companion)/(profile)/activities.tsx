import ActivityCompanion from "@/views/screens/Companion/ProfileCompanion/ActivityCompanion/ActivityCompanion";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ActivitiesIndex() {
  return (
    <SafeAreaProvider>
      <ActivityCompanion />
    </SafeAreaProvider>
  );
}
