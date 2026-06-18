import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./setpreference_page.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";
import LocationComponent from "@/views/components/LocationCard/locationcard";
import MinatComponent from "@/views/components/CapsuleList/capsule";
import GenderToggle from "@/views/components/GenderToggle/gendertoggle";
import AgeRangeSlider from "@/views/components/RangeAge/rangeage";
import DatePicker from "@/views/components/DatePicker/datepicker";
import IconTo from "@/assets/icon/to.svg";
import { useEffect, useState } from "react";
import TimeSelection from "@/views/components/TimePicker/timepicker";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "@/config/firebase_config";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { preference_list } from "@/models/types/users";
import { useAuth } from "@/controllers/hooks/useAuth";
import { startMatchingProcess } from "@/controllers/matching_controller";
import PopUpSaldo from "@/views/components/PopUpSaldo/popupsaldo";

interface DateInfo {
  date: string; // Format: YYYY-MM-DD
  day: string;  // Nama hari: Monday, Tuesday, etc
}

export default function SetPreferenceScreenPage() {
  const { userBalance } = useAuth();
  const balanceNum = Number(userBalance);
  const location = useLocation();
  const navigate = useNavigate();
  const [showSaldoPopup, setShowSaldoPopup] = useState(false);
  const [saldoKurang, setSaldoKurang] = useState(0);

  const activityId = location.state?.selectedActivityId;
  const activityName = location.state?.selectedActivityName;

  const [waktuPilihan, setWaktuPilihan] = useState({
    mode: "standard",
    startTime: "12:00",
    endTime: "13:00",
  });

  const getRatePerHour = (activityName: string) => {
    const rates: Record<string, number> = {
      "Nongkrong": 35000,
      "Olahraga": 50000,
      "Belajar": 35000,
      "Jalan-jalan": 75000,
      "Hiburan": 35000,
      "Kuliner": 35000,
    };
    return rates[activityName] || 35000;
  };

  const getDurationInMinutes = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let startTotalMins = startHour * 60 + startMinute;
    let endTotalMins = endHour * 60 + endMinute;

    if (endTotalMins <= startTotalMins) {
      endTotalMins += 24 * 60;
    }

    return endTotalMins - startTotalMins;
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(angka);
  };

  const [locationDetail, setLocationDetail] = useState({ address: "", lat: 0, lng: 0 });

  const { currentUser } = useAuth();

  const [gender, setGender] = useState("Tidak Memilih");
  const [ageRange, setAgeRange] = useState([20, 30]);

  const [tanggalMulai, setTanggalMulai] = useState<DateInfo | null>(null);
  const [tanggalSelesai, setTanggalSelesai] = useState<DateInfo | null>(null);

  const [preference, setPreference] = useState<preference_list>({ preference_names: [] });
  const [selectedPreference, setSelectedPreference] = useState<string[]>([]);

  const getPendingBookingDataIfValid = () => {
    try {
      const pendingDataStr = sessionStorage.getItem('pending_booking_data');
      if (!pendingDataStr) return null;

      const pendingData = JSON.parse(pendingDataStr);

      if (pendingData.activity_name === activityName) {
        return pendingData;
      }

      console.log("Activity berbeda, clearing pending_booking_data");
      sessionStorage.removeItem('pending_booking_data');
      return null;
    } catch (error) {
      console.error("Error parsing pending booking data:", error);
      sessionStorage.removeItem('pending_booking_data');
      return null;
    }
  };

  useEffect(() => {
    const preferenceList = doc(db, "preference_list", "list");
    const fetchPreference = onSnapshot(preferenceList, (snapshot) => {
      if (snapshot.exists()) {
        setPreference({ preference_names: snapshot.data().preference_names });
      }
    });
    return () => {
      fetchPreference();
    };
  }, []);

  useEffect(() => {
    if (!activityName) return;

    const pendingData = getPendingBookingDataIfValid();
    if (pendingData) {
      console.log("Restoring pending booking data:", pendingData);
      setGender(pendingData.gender_companion || "Tidak Memilih");
      setAgeRange(pendingData.age_range_companion || [20, 30]);
      setSelectedPreference(pendingData.preference_companion || []);
      setLocationDetail(pendingData.location || { address: "", lat: 0, lng: 0 });
      setTanggalMulai(pendingData.schedule?.start_date ? {
        date: pendingData.schedule.start_date,
        day: pendingData.schedule.start_day
      } : null);
      setTanggalSelesai(pendingData.schedule?.end_date ? {
        date: pendingData.schedule.end_date,
        day: pendingData.schedule.end_day
      } : null);
      setWaktuPilihan({
        mode: pendingData.schedule?.time_mode || "standard",
        startTime: pendingData.schedule?.start_time || "12:00",
        endTime: pendingData.schedule?.end_time || "13:00",
      });

      sessionStorage.removeItem('pending_booking_data');
    }
  }, [activityName]);

  const handlePilihTanggal = (start: DateInfo | null, end: DateInfo | null) => {
    setTanggalMulai(start);
    setTanggalSelesai(end);

    console.log("Mulai:", start);
    console.log("Selesai:", end);
  };

  const formatTanggal = (dateInfo: DateInfo | null) => {
    if (!dateInfo) return "Belum dipilih";
    const [year, month, day] = dateInfo.date.split('-');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthName = monthNames[parseInt(month) - 1];
    return `${day} ${monthName} ${year}`;
  };

  // Fungsi penangkap data dari child component
  const handleWaktuChange = (data: any) => {
    setWaktuPilihan(data);

    // Opsional: Cek di console untuk memastikan data masuk
    console.log("Waktu terpilih:", data);
  };

  const calculateTotalValidDays = () => {
    if (!tanggalMulai || !tanggalSelesai) return 0;

    const start = new Date(tanggalMulai.date);
    const end = new Date(tanggalSelesai.date);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const timeDiff = end.getTime() - start.getTime();
    let totalDays = Math.round(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    const today = new Date();
    const isStartToday =
      start.getDate() === today.getDate() &&
      start.getMonth() === today.getMonth() &&
      start.getFullYear() === today.getFullYear();

    if (isStartToday && waktuPilihan.startTime) {
      const [startHour, startMinute] = waktuPilihan.startTime.split(':').map(Number);
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();

      if (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) {
        totalDays -= 1;
      }
    }
    return Math.max(0, totalDays);
  };

  const calculateTotalPrice = () => {
    if (!activityName || !waktuPilihan.startTime || !waktuPilihan.endTime || !tanggalMulai) return 0;

    const dailyDurationMins = getDurationInMinutes(waktuPilihan.startTime, waktuPilihan.endTime);

    const validDays = calculateTotalValidDays();
    const totalDurationMins = dailyDurationMins * validDays;

    const ratePerHour = getRatePerHour(activityName);

    const total = (ratePerHour / 60) * totalDurationMins;

    return Math.round(total);
  };

  const totalPrice = calculateTotalPrice();

  const buildPreferenceData = () => {
    return {
      userId: currentUser?.uid,
      activity_name: activityName,
      gender_companion: gender,
      age_range_companion: ageRange,
      preference_companion: selectedPreference,
      schedule: {
        start_date: tanggalMulai?.date || null,
        start_day: tanggalMulai?.day || null,
        end_date: tanggalSelesai?.date || null,
        end_day: tanggalSelesai?.day || null,
        time_mode: waktuPilihan.mode,
        start_time: waktuPilihan.startTime,
        end_time: waktuPilihan.endTime,
      },
      location: locationDetail,
      status: "mencari",
      total_price: totalPrice,
      createdAt: serverTimestamp(),
    };
  };

  const handleSubmit = async () => {

    console.log("handleSubmit dipanggil");
    console.log("activityId:", activityId);
    console.log("activityName:", activityName);

    if (!activityId || !activityName) {
      alert("Data aktivitas tidak lengkap...");
      navigate("/dashboard");
      return;
    }
    if (!currentUser) {
      alert("User belum login.");
      return;
    }
    if (balanceNum < totalPrice) {
      setSaldoKurang(totalPrice - balanceNum);
      setShowSaldoPopup(true);
      return;
    }

    try {
      const finalPreferenceData = buildPreferenceData();
      console.log("Data yang akan disimpan:", finalPreferenceData);

      const bookingCollectionRef = collection(db, "bookings", currentUser.uid, "booking");
      const docRef = await addDoc(bookingCollectionRef, finalPreferenceData);
      console.log("Preference berhasil disimpan dengan ID: ", docRef.id);
      try {
        await startMatchingProcess(docRef.id, finalPreferenceData, currentUser.uid);
        console.log("Proses matching berhasil dimulai untuk booking ID:", docRef.id);
      } catch (error) {
        console.error("Error saat memulai proses matching:", error);
      }
      navigate("/match-request", { state: { bookingId: docRef.id } });
    } catch (error) {
      console.error("Error saat menyimpan preference:", error);
      alert("Gagal menyimpan preferensi. Silakan coba lagi.");
    }
  };

  return (
    <>
      <DataScreenLayout title="Ideal Companion">
        <GenderToggle onGenderChange={setGender} value={gender} />
        <AgeRangeSlider onAgeRangeChange={setAgeRange} />
        <MinatComponent
          showAddButton={false}
          preference_data={preference.preference_names}
          onMinatChange={setSelectedPreference}
        />
        <LocationComponent
          title="Tempat Ketemuan"
          label="Dimana kamu ingin bertemu?"
          onLocationSelect={(data) => {
            console.log("Koordinat didapat:", data.lat, data.lng);
            setLocationDetail(data);
          }}
        />

        <DatePicker onRangeSelect={handlePilihTanggal} />

        <div className={style.resultdate}>
          <p>{formatTanggal(tanggalMulai)}</p>
          <img src={IconTo} />
          <p>{formatTanggal(tanggalSelesai)}</p>
        </div>

        <TimeSelection onTimeChange={handleWaktuChange} />
      </DataScreenLayout>
      <footer>
        <div className={style.totalPrice}>
          <h4>Total Harga</h4>
          <h4 className={style.numberPrices}>{formatRupiah(totalPrice)}</h4>
        </div>

        <div className={style.container}>
          <Button
            variant="primary"
            className={style.button}
            onClick={handleSubmit}
          >
            Cari Teman Jalan
          </Button>
        </div>
      </footer>

      {showSaldoPopup && (
        <PopUpSaldo
          saldoKurang={saldoKurang}
          onCancel={() => {
            setShowSaldoPopup(false);
            navigate("/dashboard");
          }}
          onTopUp={() => {
            setShowSaldoPopup(false);
            const bookingData = buildPreferenceData();
            sessionStorage.setItem('pending_booking_data', JSON.stringify(bookingData));
            navigate("/topup-money");
          }}
        />
      )}
    </>
  );
}
