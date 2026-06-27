import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import styles from "./UploadIMG.style";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import IconLabel from "@/views/components/UI/IconLabel/IconLabel";
import { useTheme } from "@/controllers/hooks/useTheme";

import UploadKTP from "@/assets/image/UploadKTP.svg";

interface UploadIMGProps {
  textButton: string;
  IconComponent: React.ElementType;
  currentUrl?: string | null;
  imageContainerStyle?: StyleProp<ViewStyle>;
  CenterImageComponent?: React.ElementType;
}

export default function UploadIMG({
  textButton,
  IconComponent,
  imageContainerStyle,
  CenterImageComponent = UploadKTP,
}: UploadIMGProps) {
  const { theme } = useTheme();

  const handleButtonClick = () => {
    // Nanti diganti menggunakan expo-image-picker
    console.log("Tombol upload ditekan. Logika Firebase ditunda.");
  };

  return (
    <View
      style={[
        styles.containerImg,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.primaryBackground,
        },
      ]}
    >
      {/* Jika ada preview gambar (currentUrl), tampilkan gambar, jika tidak tampilkan Icon */}
      <IconLabel
        IconComponent={IconComponent}
        label="none"
        color={theme.colors.secondary}
        style={styles.CustomIconLabel}
        iconWidth={30}
        iconHeight={30}
        iconcontainerstyle={styles.customcontainericon}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Verifikasi Identitas Dasar</Text>
        <Text style={styles.subtitle}>
          Dengan verifikasi selfie singkat, TemanZiro tetap aman dan ramah untuk
          semua.
        </Text>
      </View>

      <View style={[styles.ktpimgcontainer, imageContainerStyle]}>
        <CenterImageComponent width={270} height={180} />
      </View>

      <GeneralButton
        variant="outline"
        shadow="none"
        style={styles.button}
        onClick={handleButtonClick}
        textStyle={styles.custombtntext}
      >
        {textButton}
      </GeneralButton>

      <Text style={styles.footerContainer}>TERENKRIPSI & AMAN</Text>
    </View>
  );
}
