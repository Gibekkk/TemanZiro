import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/controllers/hooks/useTheme";

// Import Layout & Components bawaan TemanZiro
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import LocationComponent from "@/views/components/LocationCard/LocationCard";
import PersonaSelectorComponent from "@/views/components/PersonaSelector/PersonaSelector";
import GenderSelector from "@/views/components/GenderSelector/GenderSelector";
import AgeRangeSlider from "@/views/components/RangeAgeSlider/RangeAgeSlider";
import DatePicker from "@/views/components/DatePicker/DatePicker";
import TimeSelection from "@/views/components/TimePicker/TimePicker";
import GenderIcon from "@/assets/icon/gender.svg";
import IconAge from "@/assets/icon/age.svg";
// import PopUpSaldo from "@/views/components/PopUpSaldo/PopUpSaldo";

// Icon
import IconTo from "@/assets/icon/to.svg";

// Styles
import styles from "./BookingTemanJalanScreen.style";
import { useCompanionEditProfile } from "@/controllers/hooks/Companion/useCompanionEditProfile";

interface AgeRangeSliderProps {
  onAgeRangeChange?: (range: number[]) => void;
}

interface DateInfo {
  date: string;
  day: string;
}

export default function SetPreferenceScreenPage({
  onAgeRangeChange,
}: AgeRangeSliderProps) {
  // const { gender, setGender } = useCompanionEditProfile();
  const router = useRouter();
  const { theme } = useTheme();

  // Tangkap parameter dari halaman sebelumnya (Expo Router)
  const { activityId, activityName } = useLocalSearchParams<{
    activityId: string;
    activityName: string;
  }>();

  // Mock up Context/Auth untuk sementara
  const balanceNum = 100000; // Hardcode sementara pengganti useAuth().userBalance
  const [showSaldoPopup, setShowSaldoPopup] = useState(false);
  const [saldoKurang, setSaldoKurang] = useState(0);

  // State Form
  const [gender, setGender] = useState("Tidak Memilih");
  const [ageRange, setAgeRange] = useState([20, 30]);
  const [selectedPreference, setSelectedPreference] = useState<string[]>([]);
  const [locationDetail, setLocationDetail] = useState({
    address: "",
    lat: 0,
    lng: 0,
  });

  const [tanggalMulai, setTanggalMulai] = useState<DateInfo | null>(null);
  const [tanggalSelesai, setTanggalSelesai] = useState<DateInfo | null>(null);
  const [waktuPilihan, setWaktuPilihan] = useState({
    mode: "standard",
    startTime: "12:00",
    endTime: "13:00",
  });

  const [preferenceData] = useState<string[]>([
    "Ramah",
    "Asik",
    "Pendengar Baik",
    "Fotografer",
  ]);

  const getRatePerHour = (name: string) => {
    const rates: Record<string, number> = {
      Nongkrong: 35000,
      Olahraga: 50000,
      Belajar: 35000,
      "Jalan-jalan": 75000,
      Hiburan: 35000,
      Kuliner: 35000,
    };
    return rates[name] || 35000;
  };

  const getDurationInMinutes = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let startTotalMins = startHour * 60 + startMinute;
    let endTotalMins = endHour * 60 + endMinute;

    if (endTotalMins <= startTotalMins) {
      endTotalMins += 24 * 60;
    }
    return endTotalMins - startTotalMins;
  };

  const calculateTotalValidDays = () => {
    if (!tanggalMulai || !tanggalSelesai) return 0;
    const start = new Date(tanggalMulai.date);
    const end = new Date(tanggalSelesai.date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const timeDiff = end.getTime() - start.getTime();
    let totalDays = Math.round(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, totalDays);
  };

  const calculateTotalPrice = () => {
    if (
      !activityName ||
      !waktuPilihan.startTime ||
      !waktuPilihan.endTime ||
      !tanggalMulai
    )
      return 0;
    const dailyDurationMins = getDurationInMinutes(
      waktuPilihan.startTime,
      waktuPilihan.endTime,
    );
    const validDays = calculateTotalValidDays();
    const totalDurationMins = dailyDurationMins * validDays;
    const ratePerHour = getRatePerHour(activityName);
    const total = (ratePerHour / 60) * totalDurationMins;
    return Math.round(total);
  };

  const totalPrice = calculateTotalPrice();

  const formatRupiah = (angka: number) => {
    return `Rp ${angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const formatTanggal = (dateInfo: DateInfo | null) => {
    if (!dateInfo) return "Belum dipilih";
    const [year, month, day] = dateInfo.date.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const monthName = monthNames[parseInt(month) - 1];
    return `${day} ${monthName} ${year}`;
  };

  const handlePilihTanggal = (start: DateInfo | null, end: DateInfo | null) => {
    setTanggalMulai(start);
    setTanggalSelesai(end);
  };

  const handleSubmit = () => {
    if (!activityId || !activityName) {
      Alert.alert("Error", "Data aktivitas tidak lengkap...");
      router.push("/(tabs)/(dashboard)/dashboard");
      return;
    }

    if (balanceNum < totalPrice) {
      setSaldoKurang(totalPrice - balanceNum);
      setShowSaldoPopup(true);
      return;
    }

    // Navigasi ke halaman match request langsung tanpa fetching database
    router.push({
      pathname: "/booker/matchrequest",
      params: { bookingId: "dummy-id-123" }
    });
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: theme.colors.primaryBackground },
      ]}
    >
      {/* AREA SCROLL KONTEN */}
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      > */}
          <SecondaryLayout title="Ideal Companion">
            <View style={styles.card}>
              <View style={styles.titleWrapper}>
                <GenderIcon width={24} height={24} />
                {/* Menggunakan warna teks utama dari theme */}
                <Text
                  style={[
                    styles.title,
                    { color: theme.colors.primary || "#0F172A" },
                  ]}
                >
                  Jenis Kelamin
                </Text>
              </View>
              <GenderSelector
                value={gender}
                onChange={(newGender) => {
                  setGender(newGender);
                  console.log("Selected gender:", newGender);
                }}
              />
            </View>

            <View style={styles.card}>
              <View style={styles.sliderHeader}>
                <View style={styles.titleWrapper}>
                  <IconAge width={24} height={24} />
                  <Text
                    style={[
                      styles.title,
                      { color: theme.colors.primary || "#0F172A" },
                    ]}
                  >
                    Rentan Umur
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {/* Menggunakan state ageRange yang ada di screen ini */}
                    {ageRange[0]} -{" "}
                    {ageRange[1] === 60 ? `${ageRange[1]}+` : ageRange[1]}
                  </Text>
                </View>
              </View>

              <AgeRangeSlider
                values={ageRange}
                onAgeRangeChange={setAgeRange}
              />
            </View>

            <PersonaSelectorComponent
              showAddButton={false}
              preference_data={preferenceData}
              onMinatChange={setSelectedPreference}
            />

            <LocationComponent
              title="Tempat Ketemuan"
              label="Dimana kamu ingin bertemu?"
              // onLocationSelect={(data) => setLocationDetail(data)}
            />

            <DatePicker onRangeSelect={handlePilihTanggal} />

            {/* Wrapper Indikator Tanggal Terpilih */}
            <View
              style={[
                styles.resultDateContainer,
                { backgroundColor: theme.colors.secondaryBackground },
              ]}
            >
              <Text style={[styles.dateText, { color: theme.colors.primary }]}>
                {formatTanggal(tanggalMulai)}
              </Text>
              <IconTo
                width={20}
                height={20}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.dateText, { color: theme.colors.primary }]}>
                {formatTanggal(tanggalSelesai)}
              </Text>
            </View>

            <TimeSelection onTimeChange={setWaktuPilihan} style={styles.spaceBottom}/>
          </SecondaryLayout>
      {/* </KeyboardAvoidingView> */}

      {/* FOOTER FIXED BAWAH */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.primaryBackground,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.priceContainer}>
          <Text
            style={[styles.priceLabel, { color: theme.colors.textPrimary }]}
          >
            Total Harga
          </Text>
          <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
            {formatRupiah(totalPrice)}
          </Text>
        </View>

        <GeneralButton
          variant="primary"
          style={styles.submitButton}
          onClick={handleSubmit}
        >
          Cari Teman Jalan
        </GeneralButton>
      </View>

      {/* POPUP KEKURANGAN SALDO */}
      {/* {showSaldoPopup && (
        <PopUpSaldo
          saldoKurang={saldoKurang}
          onCancel={() => {
            setShowSaldoPopup(false);
            router.back();
          }}
          onTopUp={() => {
            setShowSaldoPopup(false);
            // Storage logic disederhanakan/dihapus sementara
            router.push("/topup-money");
          }}
        />
      )} */}
    </View>
  );
}
