import React from "react";
import { View, Text } from "react-native";
import OnboardingLayout from "@/views/layouts/AuthLayout/AuthLayout";
import Button from "@/views/components/GeneralButton/GeneralButton";
import IconLabel from "@/views/components/UI/IconLabel/IconLabel";

// Import SVG
import ImgZiro from "@/assets/image/ziro-login.svg";
import ImgTalkZiro from "@/assets/image/loginziro2.svg";
import ImgCity from "@/assets/image/background-kota.svg";
import { useTheme } from "@/controllers/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { ShieldCheck, UsersRound } from "lucide-react-native";

import styles from "./AuthScreen.style";
import { router } from "expo-router";

export default function LoginRegistPage() {
  const { theme } = useTheme();
  const handleNext = () => {
    router.push("/verification/ChooseRoleScreen_Call");
  };

  return (
    <OnboardingLayout>
      {/* --- Bagian Hero (Kota, Ziro, dan Lengkungan) --- */}
      <View style={styles.heroSection}>
        {/* Layer 1: Latar Belakang Kota */}
        <View style={styles.cityBackground}>
          <ImgCity
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </View>

        {/* Layer 2: Maskot Ziro */}
        <View style={styles.mascotWrapper}>
          <ImgZiro
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </View>

        <View style={styles.ziroTalk}>
          <ImgTalkZiro
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </View>

        {/* Layer 3: Gunung Tumpul / Lengkungan Putih */}
        <View
          style={[
            styles.curveMound,
            { backgroundColor: theme.colors.primaryBackground },
          ]}
        />
      </View>

      {/* --- Bagian Konten Teks & Tombol --- */}
      <View style={styles.contentContainer}>
        <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
          Selamat Datang di {"\n"}
          <Text style={styles.textHighlight1}>
            Teman<Text style={[{ color: theme.colors.secondary }]}>Ziro</Text>
          </Text>
        </Text>

        <Text style={styles.description}>
          Temukan teman untuk kegiatan positif {"\n"}di dunia nyata. Tempat
          bersosialisasi {"\n"} yang{" "}
          <Text
            style={[styles.textHighlight, { color: theme.colors.secondary }]}
          >
            aman{" "}
          </Text>
          untuk{" "}
          <Text
            style={[styles.textHighlight, { color: theme.colors.secondary }]}
          >
            nongkrong{" "}
          </Text>
          dan{" "}
          <Text
            style={[styles.textHighlight, { color: theme.colors.secondary }]}
          >
            belajar
          </Text>
          .
        </Text>

        <Button onClick={handleNext} variant="primary" style={styles.button}>
          Mulai Sekarang
        </Button>
      </View>

      {/* --- Bagian Logo / Icon Label --- */}
      <View style={styles.logoContainers}>
        <IconLabel
          icon={<ShieldCheck size={24} color="white" />}
          label="Terverifikasi"
          desc={`Akun aman\ndan terpercaya`}
        />
        <IconLabel
          icon={<UsersRound size={24} color="white" />}
          label="Sosial"
          desc={`Komunitas positif\ndan suportif`}
        />
        <IconLabel
          icon={<Feather name="book-open" size={24} color="white" />}
          label="Belajar"
          desc={`Kembangkan diri\ndan wawasan`}
        />
      </View>
    </OnboardingLayout>
  );
}
