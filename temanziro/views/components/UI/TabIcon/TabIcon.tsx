// @/views/components/UI/TabIcon/TabIcon.tsx

import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg"; 

interface TabIconProps {
  focused: boolean;
  label: string;
  ActiveIcon?: React.FC<{ width: number; height: number }>;
  InactiveIcon?: React.FC<{ width: number; height: number }>;
  isProfile?: boolean; 
}

export default function TabIcon({
  focused,
  ActiveIcon,
  InactiveIcon,
  label,
  isProfile = false, // Nilai default jika tidak diisi
}: TabIconProps) {
  const { theme } = useTheme();
  const Icon = focused ? ActiveIcon : InactiveIcon;

  return (
    <View
      style={{
        backgroundColor: focused ? theme.colors.secondary : "transparent",
        borderRadius: 15,
        marginTop: 50,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 6,
        paddingVertical: 25, 
        paddingHorizontal: 12, 
        minWidth: 70,
        minHeight: 55,
      }}
    >
      {isProfile ? (
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 15,
            overflow: "hidden",
            borderWidth: 1.5,
            borderColor: theme.colors.lightText,
            
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IMGMiniZiro />
        </View>
      ) : (
        Icon && <Icon width={20} height={20} />
      )}
      
      <Text
        style={{
          color: focused 
            ? (isProfile ? theme.colors.lightText : theme.colors.lightText) 
            : "#8E8E93",
          fontSize: 12,
          fontWeight: focused ? "600" : "400",
        }}
      >
        {label}
      </Text>
    </View>
  );
}