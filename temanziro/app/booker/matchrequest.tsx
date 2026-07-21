import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MatchRequestUser from "@/views/screens/User/MatchRequestScreen/MatchRequestScreen";

export default function MatchRequestIndex() {
  return (
    <SafeAreaProvider>
      <MatchRequestUser />
    </SafeAreaProvider>
  );
}