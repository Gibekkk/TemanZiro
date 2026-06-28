import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./RoleCardToggle.style";

interface RoleCardProps {
  title: string;
  description: string;
  roleName: string;
  ImageComponent: React.ElementType;
  IconComponent: React.ElementType;
  isActive: boolean;
  onSelect: () => void;
}

export default function RoleCard({
  title,
  description,
  roleName,
  ImageComponent,
  IconComponent,
  isActive,
  onSelect,
}: RoleCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.roleContainer, isActive && styles.activeCard]}
      onPress={onSelect}
    >
      <View style={styles.imgContainer}>
        {/* Lebar dan tinggi bisa disesuaikan dengan ukuran asli SVG-mu */}
        <ImageComponent
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.contentTitle}>
          <IconComponent width={20} height={20} />
          <Text style={styles.titleText}>{title}</Text>
        </View>

        <Text style={styles.contentText}>{description}</Text>

        <View style={styles.footerContent}>
          <Text style={styles.roleNameText}>{roleName}</Text>

          <View style={[styles.nextButton, isActive && styles.activeButton]}>
            <Text
              style={[
                styles.nextButtonText,
                isActive && styles.activeButtonText,
              ]}
            >
              Pilih
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
