import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./pencairandone.module.css";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/config/firebase_config";
import { onSnapshot, collection, orderBy, query } from "firebase/firestore";

interface Transaction {
  id: string;
  bank_name: string;
  account_number: string;
  amount: number | string;
  status: string;
  createdAt: any;
}



export default function PencairanPendPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [withdrawalRequests, setWithdrawalRequests] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const withdrawalDoneDocRef = collection(db, "withdrawals", currentUser.uid, "requests");
    const q = query(withdrawalDoneDocRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const allData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Transaction[] || [];
        
        const filteredData = allData.filter(
          (item) => item.status?.toLowerCase() === "berhasil"
        );

        setWithdrawalRequests(filteredData);
      }
      setLoading(false);
    });
    return () => unsubscribe();

  }, [currentUser, navigate]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return { day: "00", month: "Jan", year: "2026" };
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('id-ID', { month: 'short' }),
      year: date.getFullYear().toString()
    };
  };

  return (
    <DataScreenLayout
      title="Informasi Pencairan Dana"
      noShadow
      alignLeft
      contentClassName={style.customPadding}
    >
      <div className={style.listWrapper}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
        ) : withdrawalRequests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Belum ada pencairan berhasil.</p>
        ) : (
          withdrawalRequests.map((trx) => {
            const { day, month, year } = formatDate(trx.createdAt);
            
            return (
              <div key={trx.id} className={style.listItem}>
                <div className={style.leftContent}>
                  {/* Blok Tanggal */}
                  <div className={style.dateBox}>
                    <span className={style.dayText}>{day}</span>
                    <span className={style.monthYearText}>
                      {month}<br />{year}
                    </span>
                  </div>

                  <div className={style.verticalDivider}></div>

                  {/* Blok Info Bank */}
                  <div className={style.infoBox}>
                    <h4 className={style.bankName}>{trx.bank_name}</h4>
                    <p className={style.accountNumber}>{trx.account_number}</p>
                    
                    <div className={style.statusWrapper}>
                      <svg viewBox="0 0 24 24" fill="currentColor" className={style.statusIcon}>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className={style.statusText}>{trx.status}</span>
                    </div>
                  </div>
                </div>

                <div className={style.amountText}>
                  Rp. {Number(trx.amount).toLocaleString('id-ID')}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DataScreenLayout>
  );
}