import React from "react";
import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import ListChatScreen from "@/views/screens/Common/ListChatScreen/ListChatScreen";

export default function ListChatIndex() {
  return (
    <SafeAreaProvider>
      {/* <ListChatScreen /> */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>List Chat Screen</Text>
      </View>
    </SafeAreaProvider>
  );
}
