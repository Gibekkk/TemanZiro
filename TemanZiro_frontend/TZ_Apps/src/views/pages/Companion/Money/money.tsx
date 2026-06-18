import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./money.module.css";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MoneyPage() {
  const { currentUser, userBalance } = useAuth();
  const navigate = useNavigate();

  const handlePencairanDana = () => {
    navigate("/form-pencairan");
  }

  const handleViewAllPencairanHistory = () => {
    navigate("/pencairan-done");
  }

  const formatRupiah = (angka: string | number = 0): string => {
    const parsedNumber = Number(angka);
    const validNumber = isNaN(parsedNumber) ? 0 : parsedNumber;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(validNumber);
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    
  }, [currentUser, navigate]);

  return (
    <DataScreenLayout
      title="Money" noShadow alignLeft
      contentClassName={style.customPadding}
    >
      <div className={style.topSection}>
        
        {/* Kartu Wallet */}
        <div className={style.walletOuter}>
          <div className={style.walletOrange}>
            <div className={style.walletInfoLeft}>
              <div className={style.iconWalletBox}>
                {/* Gunakan tag <img> jika sudah import icon di atas, atau pakai SVG fallback ini */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={style.iconWallet}>
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
                  <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
                </svg>
              </div>
              <h2 className={style.balanceAmount}>{formatRupiah(userBalance)}</h2>
            </div>
            
            <div className={style.walletInfoRight}>
              <span className={style.walletExpiry}>2/27</span>
              {/* <span className={style.walletName}>Tiara</span> */}
            </div>
          </div>
          <div className={style.walletBottomContainer}>
            <span className={style.walletBottomText}>
              E-Wallet
            </span>
            <span className={style.walletBottomTextName}>
              Nama Companion
            </span>
          </div>
        </div>

        {/* Status Akun */}
        <div className={style.statusText}>
          Akun Wallet <span>•</span> <span className={style.textOrange}>Virtual</span>
        </div>

        {/* Tombol Pencairan */}
        <button className={style.btnPencairan} onClick={handlePencairanDana}>
          Pencairan Dana
        </button>

      </div>

      {/* ============================== */}
      {/* BAGIAN BAWAH (INFORMASI RIWAYAT)*/}
      {/* ============================== */}
      <div className={style.bottomSection}>
        
        {/* INFORMASI PENDING */}
        <div>
          <div className={style.sectionHeader}>
            <h3 className={style.sectionTitle}>Informasi Pending</h3>
            {/* <button className={style.btnLihat}>Lihat</button> */}
          </div>
          
          <div className={style.infoCard}>
            <div className={style.infoCardTop}>
              <div>
                <h4 className={style.cardTopTitle}>Pencairan pending</h4>
                <p className={style.cardTopSub}>Request terakhir 20 Apr 2027</p>
              </div>
            </div>
            <hr className={style.divider} />
            <div className={style.infoCardBottom}>
              <span>Total pencairan pending</span>
              <span className={style.amount}>Rp.30.000.000</span>
            </div>
          </div>
        </div>

        {/* INFORMASI PENCAIRAN BERHASIL */}
        <div>
          <div className={style.sectionHeader}>
            <h3 className={style.sectionTitle}>Riwayat Pencairan</h3>
            <button className={style.btnLihat} onClick={handleViewAllPencairanHistory}>
              Lihat
            </button>
          </div>
          
          <div className={style.infoCard}>
            <div className={style.infoCardTop}>
              <div>
                <h4 className={style.cardTopTitle}>Pencairan berhasil</h4>
                <p className={style.cardTopSub}>Pencairan terakhir 20 Apr 2027</p>
              </div>
              {/* Fallback Icon Chevron */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={style.iconChevron}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
            <hr className={style.divider} />
            <div className={style.infoCardBottom}>
              <span>Total pencairan berhasil</span>
              <span className={style.amount}>Rp.30.000.000</span>
            </div>
          </div>
        </div>

      </div>
    </DataScreenLayout>
  );
}
