import { SafeAreaProvider } from "react-native-safe-area-context";
import DashboardCompanion from "@/views/screens/Companion/DashboardCompanion/DashboardCompanion";

export default function DashboardCompanionIndex() {
  return (
    <SafeAreaProvider>
      <DashboardCompanion />
    </SafeAreaProvider>
  );
}