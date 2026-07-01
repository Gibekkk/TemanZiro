import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackIcon from "@/assets/icon/back.svg"; // Pastikan sudah berupa SVG
import styles from "./SecondaryLayout.style";

interface SecondaryLayoutProps {
  children: ReactNode;
  title: string;
  noShadow?: boolean;
  alignLeft?: boolean;
  rightProfile?: string; // URL gambar profil
  tabsComponent?: ReactNode;
  showBackButton?: boolean;
}

export default function SecondaryLayout({
  children,
  title,
  noShadow = false,
  alignLeft = false,
  rightProfile,
  tabsComponent,
  showBackButton = true
}: SecondaryLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[
        styles.header,
        noShadow ? styles.noShadow : styles.shadow,
        { paddingTop: insets.top > 0 ? insets.top : 20 }
      ]}>
        <View style={[styles.secondHeader, alignLeft && styles.secondHeaderLeft]}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <BackIcon width={16} height={16} />
            </TouchableOpacity>
          )}

          <View style={[styles.contentHeader, alignLeft && styles.contentHeaderLeft]}>
            <Text style={[styles.title, alignLeft && styles.titleLeft]}>{title}</Text>

            {rightProfile && (
              <Image
                source={{ uri: rightProfile }}
                style={styles.profileIcon}
              />
            )}
          </View>
        </View>

        {tabsComponent && (
          <View style={styles.tabsWrapper}>{tabsComponent}</View>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.contentScreen}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: (insets.bottom || 20) + 20 },
          ]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
