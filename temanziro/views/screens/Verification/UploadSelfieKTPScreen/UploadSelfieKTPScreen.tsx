import React from "react";
import { Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

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
  const { role } = useLocalSearchParams();

  const handleSubmit = () => {
    // --- LOGIKA PERCABANGAN ROUTE ---
    if (role === "companion") {
      // Jika dia companion, arahkan ke form data companion
      router.push({
        pathname: "/verification/UploadCVPhoneNumberScreen_Call",
        params: { role },
      });
    } else {
      // Jika dia user biasa, arahkan ke form data user
      router.push({
        pathname: "/verification/VerificationDataUserScreen_Call",
        params: { role },
      });
    }
  };

  return (
    <SecondaryLayout title="Buat Akun">
      {role === "companion" ? (
        <ProgressBar title="Siapkan Selfie KTP Anda" currentStep={2} totalSteps={4} />
      ) : (
        <ProgressBar title="Siapkan Selfie KTP Anda" currentStep={2} totalSteps={3} />
      )}

      <Text style={styles.title}>Ambil Foto Selfie KTP</Text>

      <Text style={styles.subtitle}>
        Bergabunglah dengan komunitas TemanZiro. Ceritakan sedikit tentang
        dirimu agar orang lain tahu bahwa itu kamu.
      </Text>

      <UploadIMG
        textButton="Ambil/Upload Selfie KTP"
        IconComponent={LogoFotoSelfie}
        CenterImageComponent={IMGSelfie}
        centerImageWidth={150}
        centerImageHeight={150}
        imageContainerStyle={styles.containerselfiektpimg}
      />

      {/* Button Skip */}
      <GeneralButton
        variant="primary"
        style={styles.buttonSend}
        onClick={handleSubmit}
        textStyle={styles.buttonText}
      >
        Kirim
      </GeneralButton>

      <GeneralButton
        variant="ghost"
        shadow="none"
        style={styles.buttonSkip}
        onClick={handleSubmit}
        textStyle={styles.buttonText}
      >
        Lewati dulu
      </GeneralButton>
    </SecondaryLayout>
  );
}
