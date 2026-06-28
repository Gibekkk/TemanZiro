import React from "react";
import { Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

// Layout & Components
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import ProgressBar from "@/views/components/ProgressBar/ProgressBar";
import UploadIMG from "@/views/components/UploadIMG/UploadIMG";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";

// Assets
import LogoLogin1 from "@/assets/icon/logo-login1.svg";

// Styles
import styles from "./UploadKTPScreen.style";

export default function DataScreenKTPPage() {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const handleSkip = () => {
    router.push({
      pathname: "/verification/UploadSelfieKTPScreen_Call",
      params: { role },
    });
  };

  return (
    <SecondaryLayout title="Buat Akun">
      <ProgressBar title="Siapkan KTP Anda" currentStep={2} totalSteps={4} />

      <Text style={styles.title}>Ambil Foto KTP</Text>

      <Text style={styles.subtitle}>
        Bergabunglah dengan komunitas TemanZiro. Ceritakan sedikit tentang
        dirimu agar orang lain tahu bahwa itu kamu.
      </Text>

      <UploadIMG
        textButton="Ambil/Upload Foto KTP"
        IconComponent={LogoLogin1}
        // Props terkait Firebase dihapus sementara sesuai permintaan
      />

      {/* Button Skip */}
      <GeneralButton
        variant="primary"
        style={styles.buttonSend}
        onClick={handleSkip}
        textStyle={styles.buttonText}
      >
        Kirim
      </GeneralButton>

      <GeneralButton
        variant="ghost"
        shadow="none"
        style={styles.buttonSkip}
        onClick={handleSkip}
        textStyle={styles.buttonText}
      >
        Lewati dulu
      </GeneralButton>
    </SecondaryLayout>
  );
}
