import React, { ReactNode } from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";
import styles from "./GeneralButton.style";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  style?: ViewStyle;
  textStyle?: TextStyle;
  shadow?: "default" | "none";
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  style,
  textStyle,
  shadow = "default",
  disabled = false,
}: ButtonProps) {
  
  const containerStyles: ViewStyle[] = [styles.baseButton];
  const textStyles: TextStyle[] = [styles.baseText];

  if (variant === "primary") {
    containerStyles.push(styles.primaryButton);
    textStyles.push(styles.primaryText);
  } else if (variant === "outline") {
    containerStyles.push(styles.outlineButton);
    textStyles.push(styles.outlineText);
  } else if (variant === "ghost") {
    containerStyles.push(styles.ghostButton);
    textStyles.push(styles.ghostText);
  }

  if (shadow !== "none") {
    containerStyles.push(styles.hasShadow);
  }

  if (disabled) {
    containerStyles.push(styles.disabledButton);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onClick}
      disabled={disabled}
      style={[...containerStyles, style]}
    >
      {typeof children === "string" ? (
        <Text style={[...textStyles, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}