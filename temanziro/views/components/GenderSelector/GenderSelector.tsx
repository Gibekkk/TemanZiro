import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { GENDER_ICON, Gender } from "@/constants/UserDetails";
import { useTheme } from "@/controllers/hooks/useTheme";

export interface GenderSelectorProps {
  value?: Gender;
  onChange?: (gender: Gender) => void;
  disabled?: boolean;
}

export default function GenderSelector({
  value = "rahasia",
  onChange,
  disabled = false,
}: GenderSelectorProps) {
  const { theme } = useTheme();
  const genderOptions = Object.keys(GENDER_ICON) as Gender[];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.colors.tertiaryBackground, // Light peach/orange background
        borderRadius: 30,
        padding: 4,
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {genderOptions.map((genderKey) => {
        const isSelected = value === genderKey;
        const details = GENDER_ICON[genderKey];

        const GenderIcon = isSelected ? details.iconOn : details.iconOff;

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
              borderRadius: 25,
              backgroundColor: isSelected ? theme.colors.primary : "transparent",
            }}
          >
            <GenderIcon width={18} height={18} />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 14,
                fontWeight: isSelected ? "bold" : "500",
                color: isSelected ? "#ffffff" : theme.colors.textSecondary,
              }}
            >
              {details.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
