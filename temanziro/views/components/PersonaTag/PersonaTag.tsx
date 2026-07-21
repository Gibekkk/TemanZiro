import React from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";

import styles from "./PersonaTag.style";

interface TagProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Tag({ children, style, textStyle }: TagProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: `${theme.colors.primaryBackground}`,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: theme.colors.secondary },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}