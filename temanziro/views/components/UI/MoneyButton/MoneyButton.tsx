import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import IconWallet from "@/assets/icon/money.svg"; // Pastikan sudah disetup transformer SVG

import styles from "./MoneyButton.style";

interface MoneyButtonProps {
  onPress?: () => void;
}

export default function MoneyButton({ onPress }: MoneyButtonProps) {
  const { theme } = useTheme();
//   const { role } = useAuth();
  const navigation = useNavigation();

  const handleClick = () => {
    // if (onPress) {
    //   onPress();
    // } else {
    //   if (role === "companion") {
    //     navigation.navigate("money-pages" as never);
    //   } else {
    //     navigation.navigate("topup-money" as never);
    //   }
    // }
  };

  return (
    <TouchableOpacity 
      style={[styles.moneyButton, { backgroundColor: theme.colors.secondary }]} 
      onPress={handleClick}
    >
      <IconWallet width={18} height={18} />
      <Text style={[styles.moneyText, { color: theme.colors.lightText }]}>Money</Text>
    </TouchableOpacity>
  );
}