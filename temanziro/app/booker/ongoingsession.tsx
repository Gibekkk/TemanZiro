import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import OnGoingSessionUser from "@/views/screens/User/OnGoingSessionScreen/OnGoingSessionScreen";

export default function OnGoingSessionIndex() {
  return (
    <SafeAreaProvider>
      <OnGoingSessionUser />
    </SafeAreaProvider>
  );
}