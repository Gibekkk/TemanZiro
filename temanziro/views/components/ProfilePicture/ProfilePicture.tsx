import React from "react";
import { View, Image, ActivityIndicator, TouchableOpacity, Alert, StyleProp, ViewStyle, ImageStyle } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/controllers/hooks/useTheme";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";
import CameraIcon from "@/assets/icon/camerawhite.svg";
import styles from "./ProfilePicture.style";

export interface ProfilePictureProps {
  uri?: string | null;
  profileLoading?: boolean;
  showCameraIcon?: boolean;
  onImageSelected?: (uri: string) => void;
  onPressCamera?: () => void;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  avatarStyle?: StyleProp<ImageStyle>;
}

export default function ProfilePicture({
  uri,
  profileLoading = false,
  showCameraIcon = false,
  onImageSelected,
  onPressCamera,
  size = 150,
  borderWidth = 6,
  borderColor,
  containerStyle,
  avatarStyle,
}: ProfilePictureProps) {
  const { theme } = useTheme();

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        if (onImageSelected) {
          onImageSelected(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Error picking image from library:", error);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Izin Ditolak",
          "Anda harus memberikan izin kamera untuk mengambil foto."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        if (onImageSelected) {
          onImageSelected(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const handlePress = () => {
    if (onPressCamera) {
      onPressCamera();
      return;
    }

    if (onImageSelected) {
      Alert.alert("Ganti Foto Profil", "Dari mana Anda ingin mengambil foto?", [
        { text: "Batal", style: "cancel" },
        { text: "Kamera", onPress: takePhotoWithCamera },
        { text: "Galeri", onPress: pickImageFromGallery },
      ]);
    }
  };

  const isEditable = showCameraIcon && (!!onImageSelected || !!onPressCamera);
  const cameraButtonSize = Math.max(32, size * 0.28);
  const cameraIconSize = Math.max(14, cameraButtonSize * 0.45);

  const AvatarContent = () => (
    <View
      style={[
        styles.avatarContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: borderWidth,
          borderColor: borderColor || theme.colors.primary,
        },
        containerStyle,
      ]}
    >
      {profileLoading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.avatarImage,
            { borderRadius: (size - borderWidth * 2) / 2 },
            avatarStyle,
          ]}
        />
      ) : (
        <ImgPlaceholder width="100%" height="100%" />
      )}
    </View>
  );

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {isEditable ? (
        <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
          <AvatarContent />
        </TouchableOpacity>
      ) : (
        <AvatarContent />
      )}

      {showCameraIcon && (
        <TouchableOpacity
          style={[
            styles.cameraButton,
            {
              backgroundColor: theme.colors.primary,
              width: cameraButtonSize,
              height: cameraButtonSize,
              borderRadius: cameraButtonSize / 2,
              bottom: 0,
              right: 0,
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <CameraIcon width={cameraIconSize} height={cameraIconSize} />
        </TouchableOpacity>
      )}
    </View>
  );
}
