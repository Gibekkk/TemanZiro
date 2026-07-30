import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PendingSessionUser from "@/views/screens/User/PendingSessionScreen/PendingSessionScreen";

export default function PendingSessionIndex() {
  return (
    <SafeAreaProvider>
      <PendingSessionUser />
    </SafeAreaProvider>
  );
}