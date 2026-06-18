import React from "react";
import style from "./kyccard.module.css";

// Import local icon
import IconKTP from "@/assets/icon/icon-verified-non.svg";
import IconPendKTP from "@/assets/icon/icon-verification-pend.svg"; // Pastikan path ini benar sesuai struktur proyek Anda

import Button from "@/views/components/OrangeButton/orangebutton";
import { useAuth } from "@/controllers/hooks/useAuth";

export type KycStatus = "UNVERIFIED" | "PENDING" | "VERIFIED";

interface KycBannerProps {
  status: KycStatus;
  onComplete: () => void;
}

const KycBanner: React.FC<KycBannerProps> = ({ status, onComplete }) => {
  const { isComplete, isVerified } = useAuth();

  if (isComplete && isVerified) {
    return null;
  }

  // Menentukan konten teks berdasarkan status
  const isPending = status === "PENDING";

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.icon}>
          <img
            src={isPending ?  IconPendKTP : IconKTP}
            alt={isPending ? "Ikon Pending" : "Ikon KTP"}
          />
        </div>

        <div className={style.text}>
          {/* Kondisi 2: Jika PENDING, tampilkan teks proses admin */}
          {isPending ? (
            <>
              <h5 className={style.title}>Data kamu sedang diproses</h5>
              <p className={style.subtitle}>
                Mohon tunggu, admin sedang memverifikasi datamu.
              </p>
            </>
          ) : (
            /* Kondisi 3: Jika UNVERIFIED, tampilkan teks default */
            <>
              <h5 className={style.title}>Jangan lupa verifikasi datamu</h5>
              <p className={style.subtitle}>Agar bisa cari teman jalan kamu.</p>
            </>
          )}
        </div>
      </div>

      {/* Bagian Tombol */}
      <div className={style.action}>
        {/* Tombol hanya muncul jika status masih UNVERIFIED */}
        {status === "UNVERIFIED" && !isComplete && (
          <Button
            variant="primary"
            shadow="none"
            className={style.button1}
            onClick={onComplete}
          >
            Lengkapi
          </Button>
        )}
      </div>
    </div>
  );
};

export default KycBanner;
