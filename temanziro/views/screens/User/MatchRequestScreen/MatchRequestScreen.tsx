import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, Animated } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/controllers/hooks/useTheme";

// Layout & Component
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout"; 
import GeneralButton from "@/views/components/GeneralButton/GeneralButton"; 

// Styles
import styles from "./MatchRequestScreen.style";
import AnimatedGraphicBanner from "@/views/components/AnimatedGraphicBanner/AnimatedGraphicBanner";
import RequestSummaryList from "@/views/components/SummaryList/SummaryList";

export interface BookingData {
  activity_name: string;
  preference_companion: string[];
  location?: string;
  schedule: {
    start_date: any;
    end_date: any;
    start_time: string;
    end_time: string;
    time_mode: string;
  };
  status: string;
}

export default function MatchRequestScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [bookingData] = useState<BookingData>({
    activity_name: "Nongkrong",
    preference_companion: ["Ramah", "Asik", "Pendengar Baik"],
    schedule: {
      start_date: new Date(),
      end_date: new Date(),
      start_time: "12:00",
      end_time: "15:00",
      time_mode: "standard",
    },
    status: "mencari",
  });

  // const formatDate = (value: any) => {
  //   if (!value) return "-";
  //   const date =
  //     typeof value?.toDate === "function"
  //       ? value.toDate()
  //       : value instanceof Date
  //         ? value
  //         : new Date(value);
  //   if (Number.isNaN(date.getTime())) return "-";

  //   // Format tanggal sederhana untuk React Native
  //   const options: Intl.DateTimeFormatOptions = {
  //     weekday: "long",
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //   };
  //   return date.toLocaleDateString("id-ID", options);
  // };

  const handleBackToHome = () => {
    router.replace("/dashboard");
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: theme.colors.primaryBackground },
      ]}
    >
      <SecondaryLayout title="Mencari Companion Kamu" alignLeft={true}>
        <AnimatedGraphicBanner />

        {/* Text Information */}
        <View style={styles.textInfo}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Permintaan Telah Dikirim
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Kami sedang mencari teman yang tepat untuk aktivitas Anda. Tenang
            saja, kami akan segera menghubungi Anda.
          </Text>
        </View>

        {/* Request Summary Card */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.colors.primaryBackground, borderColor: theme.colors.border  },
          ]}
        >
          <Text
            style={[
              styles.summaryHeader,
              { color: theme.colors.secondary },
            ]}
          >
            REQUEST SUMMARY
          </Text>

          <RequestSummaryList loading={loading} bookingData={bookingData} />
        </View>
      </SecondaryLayout>

      {/* FOOTER FIXED BAWAH */}
      <View
        style={[
          styles.footer,
          { backgroundColor: theme.colors.primaryBackground },
        ]}
      >
        <GeneralButton
          variant="primary"
          style={styles.buttonSkip}
          onClick={handleBackToHome}
        >
          Kembali ke Home
        </GeneralButton>
      </View>
    </View>
  );
}
