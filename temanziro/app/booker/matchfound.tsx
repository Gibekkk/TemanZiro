import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MatchFoundUser from "@/views/screens/User/MatchFoundScreen/MatchFoundScreen";

export default function MatchFoundIndex() {
  return (
    <SafeAreaProvider>
      <MatchFoundUser />
    </SafeAreaProvider>
  );
}