import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ViewProfileTemanJalanUser from "@/views/screens/User/ViewProfileTemanJalanScreen/ViewProfileTemanJalanScreen";

export default function ViewProfileTemanJalanIndex() {
  return (
    <SafeAreaProvider>
      <ViewProfileTemanJalanUser />
    </SafeAreaProvider>
  );
}