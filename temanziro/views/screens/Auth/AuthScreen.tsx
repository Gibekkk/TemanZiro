import React from "react";
import { View, Text } from "react-native";
import OnboardingLayout from "@/views/layouts/AuthLayout/AuthLayout";
import Button from "@/views/components/GeneralButton/GeneralButton";
import IconLabel from "@/views/components/UI/IconLabel/IconLabel";

// Import SVG
import ImgSS1 from "@/assets/image/loginziro1.svg";
import ImgSS2 from "@/assets/image/loginziro2.svg";
import LogoLogin1 from "@/assets/icon/logo-login1.svg";
import LogoLogin2 from "@/assets/icon/logo-login2.svg";
import LogoLogin3 from "@/assets/icon/logo-login3.svg";

import styles from "./AuthScreen.style";
import { router } from "expo-router";

export default function LoginRegistPage() {
  const handleNext = () => {
    router.push("/verification/ChooseRoleScreen_Call"); 
  };

  return (
    <OnboardingLayout>
      {/* --- Bagian Login Content --- */}
      <View style={styles.contentContainer}>
        <View style={styles.imageWrapper}>
          <View style={styles.ziro}>
            <View style={styles.imageZiro1}>
              <ImgSS2
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />
            </View>
            <View style={styles.imageZiro2}>
              <ImgSS1
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />
            </View>
          </View>
        </View>

        <Text style={styles.subTitle}>
          Selamat Datang di <Text style={styles.textHighlight}>TemanZiro</Text>
        </Text>

        <Text style={styles.description}>
          Temukan teman untuk kegiatan positif di dunia nyata. Tempat
          bersosialisasi yang <Text style={styles.textHighlight}>aman </Text>
          untuk <Text style={styles.textHighlight}>nongkrong </Text>
          dan <Text style={styles.textHighlight}>belajar</Text>.
        </Text>

        <Button onClick={handleNext} variant="primary" style={styles.button}>
          Mulai Sekarang
        </Button>
      </View>

      {/* --- Bagian Logo / Icon Label --- */}
      <View style={styles.logoContainers}>
        <IconLabel IconComponent={LogoLogin1} label="Terverifikasi" />

        <IconLabel IconComponent={LogoLogin2} label="Sosial" />

        <IconLabel IconComponent={LogoLogin3} label="Belajar" />
      </View>
    </OnboardingLayout>
  );
}
