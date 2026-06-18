import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./formpencairan.module.css";
import { useState } from "react";
import IMGZiro from "@/assets/icon/zirook1.svg";
import Button from "@/views/components/OrangeButton/orangebutton";
import { useAuth } from "@/controllers/hooks/useAuth";
import { serverTimestamp, collection, addDoc } from "@firebase/firestore";
import { db } from "@/config/firebase_config";
import { useNavigate } from "react-router-dom";

export interface WithdrawalRequest {
  bank_name: string;
  withdrawal_account_number: string;
  withdrawal_amount: string;
  withdrawal_request_created_at: any;
  withdrawal_status: string;
}

export default function FormPencairanPage( ) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/money-pages");
  }

  const handleRequestSubmit = async () => {
    setErrorMessage("");
    console.log({ bank, accountNumber, amount });

    if (!currentUser) {
      alert("User belum login.");
      return;
    }

    if (!bank || !accountNumber || !amount) {
      setErrorMessage("Semua data wajib diisi!");
      alert("Semua data wajib diisi!");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMessage("Nominal harus angka");
      alert("Nominal harus angka dan lebih besar dari 0!");
      return;
    }

    setShowSuccessModal(true);

    try { 
      console.log({ bank, accountNumber, amount });
      const items = {
        bank_name: bank,
        withdrawal_account_number: accountNumber,
        withdrawal_amount: amount,
        withdrawal_request_created_at: serverTimestamp(),
        withdrawal_status: "pending",
      };
      console.log("Data yang akan disimpan:", items);
      const withdrawalCollectionRef = collection(db, "withdrawals", currentUser.uid, "requests");
      const docRef = await addDoc(withdrawalCollectionRef, items);
      console.log("Request pencairan berhasil disimpan dengan ID: ", docRef.id);

    } catch (error) {
      console.error("Error submitting pencairan request:", error);
    }
  };
  
  return (
    <DataScreenLayout
      title="Form Pencairan Dana"
      noShadow
      alignLeft
      contentClassName={style.customPadding}
    >
      <div className={style.formCard}>
        <label className={style.label}>Pilih Bank</label>
        <div className={style.inputWrapper}>
          <div className={style.iconBox}>
            {/* SVG Fallback untuk Ikon Bank */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 22 7 12 2"></polygon>
              <polyline points="2 17 2 22 22 22 22 17"></polyline>
              <polyline points="6 12 6 17"></polyline>
              <polyline points="10 12 10 17"></polyline>
              <polyline points="14 12 14 17"></polyline>
              <polyline points="18 12 18 17"></polyline>
            </svg>
          </div>
          <select
            className={`${style.inputElement} ${style.selectElement}`}
            value={bank}
            onChange={(e) => setBank(e.target.value)}
          >
            <option value="" disabled>
              Bank
            </option>
            <option value="BCA">Bank BCA</option>
            <option value="Mandiri">Bank Mandiri</option>
            <option value="BNI">Bank BNI</option>
            <option value="BRI">Bank BRI</option>
          </select>
        </div>
      </div>

      {/* --- KARTU 2: NO REKENING --- */}
      <div className={style.formCard}>
        <label className={style.label}>Masukkan No. Rekening</label>
        <div className={style.inputWrapper}>
          <input
            type="number"
            className={style.inputElement}
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="123xxxxxxx"
          />
        </div>
      </div>

      {/* --- KARTU 3: NOMINAL PENCAIRAN --- */}
      <div className={style.formCard}>
        <label className={style.label}>Masukkan Nominal Pencairan Dana</label>
        <div className={style.inputWrapper}>
          <span className={style.prefixText}>Rp.</span>
          <input
            type="text"
            className={style.inputElement}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* --- TOMBOL SUBMIT --- */}
      <Button className={style.btnRequest} onClick={handleRequestSubmit}>
        Request
      </Button>
      {showSuccessModal && (
        <div className={style.modalOverlay}>
          <div className={style.modalCard}>
            <img
              src={IMGZiro}
              alt="Ziro Success"
              className={style.mascotImage}
            />
            <h3 className={style.modalTitle}>Permintaan Berhasil Dikirim</h3>
            <p className={style.modalDesc}>
              Tunggu sebentar ya, Ziro lagi proses pencairan danamu nih.
            </p>
            <button
              className={style.btnClose}
              onClick={handleCloseModal}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </DataScreenLayout>
  );
}
