import React from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import IMGMiniZiro from "@/assets/image/mini-ziro.png"; // Gunakan format .png/.jpg untuk Image RN

import styles from "./UserProfile.style";

export default function UserProfile() {
  const { theme } = useTheme();
//   const { userProfile, loading, role } = useAuth();
  const navigation = useNavigation();

//   const photoUrl = (role === "companion" ? userProfile?.url_photoprofile_companion : userProfile?.url_photoprofile_user) || "";

  return (
    <TouchableOpacity 
      style={[styles.userAvatarWrapper, { borderColor: theme.colors.lightText }]} 
      onPress={() => navigation.navigate("profile" as never)}
    >
      <Image
        // source={loading || !photoUrl ? IMGMiniZiro : { uri: photoUrl }}
        style={styles.userAvatarImage}
      />
    </TouchableOpacity>
  );
}