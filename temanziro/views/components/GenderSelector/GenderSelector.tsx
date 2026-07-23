import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { GENDER_ICON, Gender } from "@/constants/UserDetails";
import { useTheme } from "@/controllers/hooks/useTheme";

export interface GenderSelectorProps {
  value?: string;
  onChange?: (gender: any) => void;
  disabled?: boolean;
  options?: string[];
  showIcon?: boolean;
  activeBgColor?: string;
}

export default function GenderSelector({
  value,
  onChange,
  disabled = false,
  options = ["pria", "wanita", "rahasia"],
  showIcon = true,
  activeBgColor,
}: GenderSelectorProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "rgba(242, 236, 228, 0.4)", // soft neutral background
        borderRadius: 10,
        padding: 4,
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {options.map((genderKey) => {
        const isSelected = value === genderKey;

        // Label mapping
        let label = genderKey.charAt(0).toUpperCase() + genderKey.slice(1);
        if (genderKey === "rahasia") label = "Rahasia";
        if (genderKey === "semua") label = "Semua";

        // Icon mapping (only if showIcon is true and it exists in GENDER_ICON)
        const details = GENDER_ICON[genderKey as Gender];
        const GenderIcon = showIcon && details ? (isSelected ? details.iconOn : details.iconOff) : null;

        const activeColor = activeBgColor || theme.colors.primary;

        return (
          <TouchableOpacity
            key={genderKey}
            disabled={disabled}
            onPress={() => onChange && onChange(genderKey)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: isSelected ? activeColor : "transparent",
            }}
          >
            {GenderIcon && <GenderIcon width={18} height={18} />}
            <Text
              style={{
                marginLeft: GenderIcon ? 8 : 0,
                fontSize: 14,
                fontWeight: isSelected ? "bold" : "600",
                color: isSelected ? "#ffffff" : theme.colors.textSecondary,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
