import React from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";

// Layout & Components
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import ProgressBar from "@/views/components/ProgressBar/ProgressBar";
import UploadIMG from "@/views/components/UploadIMG/UploadIMG";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";

// Assets
import LogoFotoSelfie from "@/assets/icon/fotoselfie.svg";
import IMGSelfie from "@/assets/image/UploadSelfieKTP.svg";

// Styles
import styles from "./UploadSelfieKTPScreen.style";

export default function DataScreenKTPPage() {
  const router = useRouter();

  const handleSkip = () => {
    // router.push("@/app/verification/UploadKTPScreen_Call");
  };

  return (
    <SecondaryLayout title="Buat Akun">
      <ProgressBar title="Siapkan KTP Anda" currentStep={3} totalSteps={4} />

      <Text style={styles.title}>Ambil Foto Selfie KTP</Text>

      <Text style={styles.subtitle}>
        Bergabunglah dengan komunitas TemanZiro. Ceritakan sedikit tentang
        dirimu agar orang lain tahu bahwa itu kamu.
      </Text>

      <UploadIMG
        textButton="Ambil Foto Selfie KTP"
        IconComponent={LogoFotoSelfie}
        CenterImageComponent={IMGSelfie}
        imageContainerStyle={styles.containerselfiektpimg}
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
