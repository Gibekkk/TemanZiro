import React from 'react';
import ChooseRoleScreen from '@/views/screens/Verification/ChooseRoleScreen/ChooseRoleScreen'; 
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ChooseRoleRoute() {
  return (
    <SafeAreaProvider>
      <ChooseRoleScreen />
    </SafeAreaProvider>
  );
}