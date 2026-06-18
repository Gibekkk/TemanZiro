import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./topupdone.module.css";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TopUpRequest } from "../MoneyTopup/moneytopup";

export default function TopupDonePage() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const allTopUpHistory: TopUpRequest[] = location.state?.historyData || [];


  const formatDisplayDate = (timestamp: any) => {
    if (!timestamp) return "-";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

    
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  })

  return (
    <DataScreenLayout
      title="Topup Selesai"
      noShadow
      alignLeft
      contentClassName={style.customPadding}
    >
      <div className={style.listWrapper}>
        {allTopUpHistory.length > 0 ? (
          allTopUpHistory.map((req, index) => (
            <div key={index} className={style.historyCard}>
              <div className={style.cardHeader}>
                <h4 className={
                  req.status === "Berhasil" ? style.textSuccess :
                  req.status === "Ditolak" ? style.textDanger :
                  style.textWarning
                }>
                  Top Up {req.status}
                </h4>
                <span className={style.dateText}>
                  {formatDisplayDate(req.created_at)}
                </span>
              </div>
              <hr className={style.divider} />
              <div className={style.cardBody}>
                <span>Nominal</span>
                <span className={style.amountText}>
                  Rp {req.amount?.toLocaleString() || "0"}
                </span>
              </div>
              {req.status === "Ditolak" && (
                <div className={style.declineBox}>
                  <span className={style.declineLabel}>Alasan Penolakan: </span>
                  <span className={style.declineText}>
                    {req.decline_reason || req.message || "-"}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={style.emptyState}>
            <p>Belum ada riwayat top up.</p>
            <button onClick={() => navigate("/dashboard")}>Kembali</button>
          </div>
        )}
      </div>
    </DataScreenLayout>
  );
}