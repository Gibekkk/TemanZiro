import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./formtopup.module.css";
import { useState } from "react";
import IMGZiro from "@/assets/icon/zirook1.svg";
import Button from "@/views/components/OrangeButton/orangebutton";
import { useAuth } from "@/controllers/hooks/useAuth";
import { serverTimestamp, collection, addDoc, doc } from "@firebase/firestore";
import { db } from "@/config/firebase_config";
import { useNavigate } from "react-router-dom";
import { TopUpRequest } from "../MoneyTopup/moneytopup";


export default function FormTopupMoneyPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Pilihan nominal preset
  const presetNominals = ["20000", "50000", "100000"];

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/topup-money");
  };

  const handleRequestSubmit = async () => {
    setErrorMessage("");

    if (!currentUser) {
      alert("User belum login.");
      return;
    }

    if (!amount) {
      setErrorMessage("Nominal top up wajib diisi!");
      alert("Nominal top up wajib diisi!");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMessage("Nominal harus angka dan lebih besar dari 0");
      alert("Nominal harus angka dan lebih besar dari 0!");
      return;
    }

    setShowSuccessModal(true);

    try {
      const items: TopUpRequest = {
        amount: Number(amount),
        status: "Menunggu",
        created_at: serverTimestamp(),
        decline_reason: "",
      };
      
      console.log("Data yang akan disimpan:", items);
      
      const topupCollectionRef = collection(db, "top_ups", currentUser.uid, "requests");
      const docRef = await addDoc(topupCollectionRef, items);
      console.log("Request topup berhasil disimpan dengan ID: ", docRef.id);
    } catch (error) {
      console.error("Error submitting topup request:", error);
    }
  };

  return (
    <DataScreenLayout
      title="Form Top Up Dana"
      noShadow
      alignLeft
      contentClassName={style.customPadding}
    >
      <div className={style.formCard}>
        <label className={style.label}>Pilih Nominal Top Up</label>
        <div className={style.presetContainer}>
          {presetNominals.map((nom) => (
            <button
              key={nom}
              className={`${style.presetButton} ${
                amount === nom ? style.presetActive : ""
              }`}
              onClick={() => setAmount(nom)}
            >
              Rp {parseInt(nom).toLocaleString("id-ID")}
            </button>
          ))}
        </div>
      </div>

      <div className={style.formCard}>
        <label className={style.label}>Atau Masukkan Nominal Lain</label>
        <div className={style.inputWrapper}>
          <span className={style.prefixText}>Rp.</span>
          <input
            type="number"
            className={style.inputElement}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <Button className={style.btnRequest} onClick={handleRequestSubmit}>
        Top Up
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
              Tunggu sebentar ya, Ziro lagi proses top up danamu nih.
            </p>
            <button className={style.btnClose} onClick={handleCloseModal}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </DataScreenLayout>
  );
}