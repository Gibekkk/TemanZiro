import React, { useState } from "react";
import { View, Text, StyleProp, ViewStyle, Alert, Image } from "react-native";
import styles from "./UploadIMG.style";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import IconLabel from "@/views/components/UI/IconLabel/IconLabel";
import { useTheme } from "@/controllers/hooks/useTheme";
import * as ImagePicker from "expo-image-picker";

import UploadKTP from "@/assets/image/UploadKTP.svg";

interface UploadIMGProps {
  textButton: string;
  IconComponent: React.ElementType;
  currentUrl?: string | null;
  imageContainerStyle?: StyleProp<ViewStyle>;
  CenterImageComponent?: React.ElementType;
  centerImageWidth?: number;
  centerImageHeight?: number;
  onImageSelected?: (uri: string) => void;
}

export default function UploadIMG({
  textButton,
  IconComponent,
  imageContainerStyle,
  CenterImageComponent = UploadKTP,
  centerImageWidth = 270,
  centerImageHeight = 180,
  onImageSelected,
  currentUrl,
}: UploadIMGProps) {
  const { theme } = useTheme();

  const [previewUri, setPreviewUri] = useState<string | null>(
    currentUrl || null,
  );

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8, 
    });

    if (!result.canceled) {
      setPreviewUri(result.assets[0].uri);
      if (onImageSelected) onImageSelected(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Izin Ditolak",
        "Anda harus memberikan izin kamera untuk mengambil foto.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPreviewUri(result.assets[0].uri);
      if (onImageSelected) onImageSelected(result.assets[0].uri);
    }
  };

  const handleButtonClick = () => {
    Alert.alert("Pilih Gambar", "Dari mana Anda ingin mengambil gambar?", [
      { text: "Batal", style: "cancel" },
      { text: "Kamera", onPress: takePhotoWithCamera },
      { text: "Galeri", onPress: pickImageFromGallery },
    ]);
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
        {previewUri ? (
          <Image
            source={{ uri: previewUri }}
            style={{
              width: centerImageWidth,
              height: centerImageHeight,
              // borderRadius: 15,
            }}
            resizeMode="cover"
          />
        ) : (
          <CenterImageComponent
            width={centerImageWidth}
            height={centerImageHeight}
          />
        )}
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
