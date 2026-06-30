import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { useNavigation } from "@react-navigation/native";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";

import styles from "./UserProfile.style";

export default function UserProfile() {
  const { theme } = useTheme();
  const { userProfile, profileLoading, role } = useUserProfile();
  const navigation = useNavigation();

  const photoUrl = userProfile
    ? ("url_photoprofile_companion" in userProfile
      ? userProfile.url_photoprofile_companion
      : userProfile.url_photoprofile_user)
    : "";

  return (
    <TouchableOpacity
      style={[styles.userAvatarWrapper, { borderColor: theme.colors.lightText }]}
      onPress={() => navigation.navigate("profile" as never)}
    >
      {profileLoading || !photoUrl ? (
        <IMGMiniZiro width="100%" height="100%" />
      ) : (
        <Image
          source={{ uri: photoUrl }}
          resizeMode="cover"
          style={styles.userAvatarImage}
        />
      )}
    </TouchableOpacity>
  );
}