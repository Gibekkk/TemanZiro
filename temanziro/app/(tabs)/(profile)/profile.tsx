import React from "react";
import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ProfileIndex() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile Screen</Text>
      </View>
    </SafeAreaProvider>
  );
}
