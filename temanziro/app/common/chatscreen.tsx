import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ChatScreen from "@/views/screens/Common/ChatScreen/ChatScreen";


export default function ProfileIndex() {
  return (
    <SafeAreaProvider>
      <ChatScreen />
    </SafeAreaProvider>
  );
}
