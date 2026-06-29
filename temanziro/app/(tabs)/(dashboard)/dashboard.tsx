import { SafeAreaProvider } from "react-native-safe-area-context";
import DashboardUser from "@/views/screens/User/DashboardUserScreen/DashboardUserScreen"; // Sesuaikan path-nya

export default function DashboardIndex() {
  return (
    <SafeAreaProvider>
      <DashboardUser />
    </SafeAreaProvider>
  );
}
