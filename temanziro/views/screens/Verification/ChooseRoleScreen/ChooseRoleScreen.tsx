import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

// Layout & Components
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import ProgressBar from "@/views/components/ProgressBar/ProgressBar";
import RoleCard from "@/views/components/RoleCardToggle/RoleCardToggle";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";

// Assets (Pastikan ini adalah komponen SVG yang valid)
import IconRole1 from "@/assets/icon/role1.svg";
import IconRole2 from "@/assets/icon/role2.svg";
import ImgRoleBooker from "@/assets/icon/roleuser.svg";
import ImgRoleCompanion from "@/assets/icon/rolecompanion.svg";

// Styles
import styles from "./ChooseRoleScreen.style";

export default function DataScreenRolePage() {
  const [selectedRole, setSelectedRole] = useState("booker");
  const router = useRouter();

  const handleNavigation = () => {
    console.log(`Lanjutkan sebagai: ${selectedRole}`);
    router.push({
      pathname: "/verification/UploadKTPScreen_Call",
      params: { role: selectedRole },
    });
  };

  const roles = [
    {
      id: "booker",
      title: "Saya ingin mencari companion",
      description:
        "Temukan penduduk lokal ramah untuk menemani aktivitas atau sekadar berbagi obrolan bermakna.",
      roleName: "PERAN BOOKER",
      ImageComponent: ImgRoleBooker,
      IconComponent: IconRole1,
    },
    {
      id: "companion",
      title: "Saya ingin menjadi companion",
      description:
        "Jadilah teman perjalanan bagi orang lain dan dapatkan penghasilan tambahan dari waktu luang Anda.",
      roleName: "PERAN COMPANION",
      ImageComponent: ImgRoleCompanion,
      IconComponent: IconRole2,
    },
  ];

  return (
    <SecondaryLayout title="TemanZiro" alignLeft>
      <ProgressBar title="Pilih Peran Anda" currentStep={1} totalSteps={4} />

      <Text style={styles.title}>
        Bagaimana Anda ingin menggunakan TemanZiro?
      </Text>

      <Text style={styles.subtitle}>
        Pilih peran untuk menyesuaikan pengalaman Anda.
      </Text>

      {roles.map((role) => (
        <RoleCard
          key={role.id}
          title={role.title}
          description={role.description}
          roleName={role.roleName}
          ImageComponent={role.ImageComponent}
          IconComponent={role.IconComponent}
          isActive={selectedRole === role.id}
          onSelect={() => setSelectedRole(role.id)}
        />
      ))}

      <View style={styles.actionContainer}>
        <GeneralButton
          variant="primary"
          style={styles.fullWidthBtn}
          onClick={handleNavigation}
        >
          {selectedRole === "booker" ? (
            <Text style={styles.btntext}>Lanjutkan sebagai Booker</Text>
          ) : (
            <Text style={styles.btntext}>Lanjutkan sebagai Companion</Text>
          )}
        </GeneralButton>

        <Text style={styles.footerDesc}>
          Dengan memilih peran ini, Anda setuju dengan syarat dan ketentuan yang
          berlaku.
        </Text>
      </View>
    </SecondaryLayout>
  );
}
