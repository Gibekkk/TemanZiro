import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./moneytopup.module.css";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase_config";

export interface TopUpRequest {
  amount?: number;
  status: "Berhasil" | "Ditolak" | "Menunggu";
  created_at?: any;
  message?: string;
  updated_at?: any;
  decline_reason:string;
}

export default function MoneyUserPage() {
  const { currentUser, userBalance, userProfile } = useAuth();
  const [requests, setRequests] = useState<TopUpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  let formattedDate = "00/00";

  if (userProfile?.createdAt) {
    let date;

    if (userProfile.createdAt.seconds) {
      date = new Date(userProfile.createdAt.seconds * 1000);
    } 
    else if (typeof userProfile.createdAt.toDate === 'function') {
      date = userProfile.createdAt.toDate();
    } 
    else {
      date = new Date(userProfile.createdAt);
    }
    
    if (!isNaN(date.getTime())) {
      const year = String(date.getFullYear()).slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      formattedDate = `${month}/${year}`;
    }
  }


  // const [statusTransaction, setStatusTransaction] = useState("pending");
  // const statusMap: Record<string, { text: string; colorClass: string }> = {
  //   berhasil: { text: "Topup Berhasil", colorClass: style.textSuccess },
  //   tolak: { text: "Topup Ditolak", colorClass: style.textDanger },
  //   pending: { text: "Topup Pending", colorClass: style.textWarning },
  // };
  // const currentStatus = statusMap[statusTransaction] || {
  //   text: "Status Tidak Diketahui",
  //   colorClass: style.textDefault,
  // };

  const handleTopUpDana = () => {
    navigate("/form-topup-money");
  };

  const handleViewAllTopUpHistory = () => {
    navigate("/topup-done", {
      state: {
        historyData: requests,
      }
    });
  };

  

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const requestsTopUpRef = collection(db, "top_ups", currentUser.uid, "requests");
    const q = query(requestsTopUpRef, orderBy("created_at", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedData = snapshot.docs.map((doc) => {
          const data = doc.data();
          
          const rawDate = data.created_at;

          return {
            // id: doc.id,
            ...data,
            status: data.status || "Menunggu",
            created_at: rawDate,
          };
        }) as TopUpRequest[];

        setRequests(fetchedData);
      } else {
        setRequests([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data top-up:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatDisplayDate = (timestamp: any) => {
    if (!timestamp) return "-";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const hasPendingRequest = requests.some((req) => req.status === "Menunggu");
  const latestRequest = requests.length > 0 ? requests[0] : null;

  const statusMap: Record<string, { text: string; colorClass: string }> = {
    Berhasil: { text: "Topup Berhasil", colorClass: style.textSuccess },
    Ditolak: { text: "Topup Ditolak", colorClass: style.textDanger },
    Menunggu: { text: "Topup Diproses", colorClass: style.textWarning },
  };

  const currentStatus = latestRequest 
    ? (statusMap[latestRequest.status] || { text: `Topup ${latestRequest.status}`, colorClass: style.textDefault })
    : { text: "Belum ada riwayat topup", colorClass: style.textDefault };


  return (
    <DataScreenLayout
      title="Money"
      noShadow
      alignLeft
      contentClassName={style.customPadding}
    >
      <div className={style.topSection}>
        {/* Kartu Wallet */}
        <div className={style.walletOuter}>
          <div className={style.walletOrange}>
            <div className={style.walletInfoLeft}>
              <div className={style.iconWalletBox}>
                {/* Gunakan tag <img> jika sudah import icon di atas, atau pakai SVG fallback ini */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={style.iconWallet}
                >
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                  <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                </svg>
              </div>
              <h2 className={style.balanceAmount}>Rp. {userBalance?.toLocaleString()}</h2>
            </div>

            <div className={style.walletInfoRight}>
              <span className={style.walletExpiry}>{formattedDate}</span>
            </div>
          </div>
          <div className={style.walletBottomContainer}>
            <span className={style.walletBottomText}>E-Wallet</span>
            <span className={style.walletBottomTextName}>{userProfile?.name_user || "Nama User"}</span>
          </div>
        </div>

        {/* Status Akun */}
        <div className={style.statusText}>
          Akun Wallet <span>•</span>{" "}
          <span className={style.textOrange}>Virtual</span>
        </div>

        {/* Tombol Pencairan */}
        <button 
          className={style.btnPencairan} 
          onClick={handleTopUpDana}
          disabled={hasPendingRequest}
          style={{ opacity: hasPendingRequest ? 0.6 : 1, cursor: hasPendingRequest ? 'not-allowed' : 'pointer' }}
        >
          {hasPendingRequest ? "Menunggu Proses..." : "Top up"}
        </button>
      </div>

      {/* ============================== */}
      {/* BAGIAN BAWAH (INFORMASI RIWAYAT)*/}
      {/* ============================== */}
      <div className={style.bottomSection}>
        {/* INFORMASI PENCAIRAN BERHASIL */}
        <div>
          <div className={style.sectionHeader}>
            <h3 className={style.sectionTitle}>Riwayat Topup</h3>
            <button
              className={style.btnLihat}
              onClick={handleViewAllTopUpHistory}
            >
              Lihat
            </button>
          </div>

          <div className={style.infoCard}>
            <div className={style.infoCardTop}>
              <div>
                <h4
                  className={`${style.cardTopTitle} ${currentStatus.colorClass}`}
                >
                  {currentStatus.text}
                </h4>
                <p className={style.cardTopSub}>
                  Tanggal terakhir {latestRequest ? formatDisplayDate(latestRequest.created_at) : "Belum ada riwayat topup"}
                </p>
              </div>
              {/* Fallback Icon Chevron */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={style.iconChevron}
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
            <hr className={style.divider} />
            <div className={style.infoCardBottom}>
              <span>Nominal Topup</span>
              <span className={style.amount}>Rp.{requests.length > 0 ? requests[0].amount?.toLocaleString() : "0"}</span>
            </div>
          </div>
        </div>
      </div>
    </DataScreenLayout>
  );
}
