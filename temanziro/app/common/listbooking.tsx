import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ListBooking from "@/views/screens/Common/ListBookingScreen/ListBookingScreen";


export default function ProfileIndex() {
  return (
    <SafeAreaProvider>
      <ListBooking />
    </SafeAreaProvider>
  );
}
