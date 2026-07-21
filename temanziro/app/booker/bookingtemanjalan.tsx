import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BookingTemanJalanUser from "@/views/screens/User/BookingTemanJalanScreen/BookingTemanJalanScreen";

export default function BookingTemanJalanIndex() {
  return (
    <SafeAreaProvider>
      <BookingTemanJalanUser />
    </SafeAreaProvider>
  );
}