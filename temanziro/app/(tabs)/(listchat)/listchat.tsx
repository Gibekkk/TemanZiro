import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ListChatScreen from "@/views/screens/Common/ListChatScreen/ListChatScreen";

export default function ListChatIndex() {
  return (
    <SafeAreaProvider>
      <ListChatScreen />
    </SafeAreaProvider>
  );
}