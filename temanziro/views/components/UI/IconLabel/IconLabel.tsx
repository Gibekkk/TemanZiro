import React from "react";
import { View, Text } from "react-native";
import styles from "./IconLabel.style";

// Mengasumsikan icon yang dikirim sudah berupa komponen SVG dari react-native-svg
interface IconLabelProps {
  IconComponent: React.ElementType; 
  label: string;
  color?: string;
}

export default function IconLabel({ IconComponent, label, color }: IconLabelProps) {
  return (
    <View style={styles.logoWrapper}>
      <View
        style={[
          styles.container,
          color ? { backgroundColor: `${color}33` } : {}, // Menambahkan opacity 20% (hex 33) seperti color-mix
        ]}
      >
        <IconComponent width={24} height={24} />
      </View>
      {label && label !== "none" && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}