import React from "react";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="activities" />
      {/* <Stack.Screen name="persona" />
      <Stack.Screen name="reviews" /> */}
    </Stack>
  );
}
