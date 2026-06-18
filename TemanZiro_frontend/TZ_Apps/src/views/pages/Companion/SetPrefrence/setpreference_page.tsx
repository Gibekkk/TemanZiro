import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./setpreference_page.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";
import LocationComponent from "@/views/components/LocationCard/locationcard";
import MinatComponent from "@/views/components/CapsuleList/capsule";
import GenderToggle from "@/views/components/GenderToggle/gendertoggle";
import AgeRangeSlider from "@/views/components/RangeAge/rangeage";
import DatePicker from "@/views/components/DatePicker/datepicker";
import IconTo from "@/assets/icon/to.svg";
import  { useEffect, useState } from "react";
import TimeSelection from "@/views/components/TimePicker/timepicker";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "@/config/firebase_config";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { preference_list } from "@/models/types/users";
import { useAuth } from "@/controllers/hooks/useAuth";

interface DateInfo {
  date: string;
  day: string;
}

export default function SetPreferenceScreenPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const [gender, setGender] = useState("Tidak Memilih");
  const [ageRange, setAgeRange] = useState([20, 30]);

  const activityId = location.state?.selectedActivityId;
  const activityName = location.state?.selectedActivityName;

  const [tanggalMulai, setTanggalMulai] = useState<DateInfo | null>(null);
  const [tanggalSelesai, setTanggalSelesai] = useState<DateInfo | null>(null);
  const [waktuPilihan, setWaktuPilihan] = useState({
    mode: "standard",
    startTime: "12:00",
    endTime: "13:00",
  });

  const [ preference, setPreference ] = useState<preference_list>({ preference_names: [] });
  const [selectedPreference, setSelectedPreference] = useState<string[]>([]);

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

  const handlePilihTanggal = (start: DateInfo | null, end: DateInfo | null) => {
    setTanggalMulai(start);
    setTanggalSelesai(end);

    console.log("Mulai:", start);
    console.log("Selesai:", end);
  };

  const formatTanggal = (dateInfo: DateInfo | null) => {
    if (!dateInfo) return "Belum dipilih";

    const [year, month, day] = dateInfo.date.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${day} ${monthName} ${year}`;
  };

  // Fungsi penangkap data dari child component
  const handleWaktuChange = (data: any) => {
    setWaktuPilihan(data);

    // Opsional: Cek di console untuk memastikan data masuk
    console.log("Waktu terpilih:", data);
  };

  const handleSubmit = async () => {
    // const user = auth.currentUser;
    // if (!user) {
    //   console.error("User tidak ditemukan");
    //   return;
    // }

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
    try {
      const finalPreferenceData = {
        // userId: user.uid,
        activity_name: activityName,
        gender_companion: gender,
        age_range_companion: ageRange,
        preference_companion: selectedPreference,

        schedule: {
          start_date: tanggalMulai,
          end_date: tanggalSelesai,
          time_mode: waktuPilihan.mode,
          start_time: waktuPilihan.startTime,
          end_time: waktuPilihan.endTime,
        },
        // location:
        // status: "pending",
        // total_price:
        createdAt: serverTimestamp(),
      };
      console.log("Data yang akan disimpan:", finalPreferenceData);
      const bookingCollectionRef = collection(db, "bookings", currentUser.uid, "booking");
      const docRef = await addDoc(bookingCollectionRef, finalPreferenceData);
      console.log("Preference berhasil disimpan dengan ID: ", docRef.id);
      navigate("/match-request", { state: { preferenceId: docRef.id } });
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
          <h4 className={style.numberPrices}>Rp.70.000</h4>
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
    </>
  );
}
