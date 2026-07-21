import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ConfirmationTemanJalanUser from "@/views/screens/User/ConfirmationTemanJalanScreen/ConfirmationTemanJalanScreen";

export default function MatchFoundIndex() {
  return (
    <SafeAreaProvider>
      <ConfirmationTemanJalanUser />
    </SafeAreaProvider>
  );
}