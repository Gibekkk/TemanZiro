import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/controllers/hooks/useTheme";

import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";

import IconCoffe from "@/assets/icon/coffe.svg";
import IconVerifiedSafety from "@/assets/icon/verifiedsafety.svg";
import IconLocation from "@/assets/icon/location.svg";
import IconDate from "@/assets/icon/date.svg";
import IconPay from "@/assets/icon/pay.svg";
import IconCopy from "@/assets/icon/copytext.svg";
import PaymentZiro from "@/assets/image/paymentziro.png";

import styles from "./ConfirmationTemanJalanScreen.style";

// 🌟 Ambil ukuran tinggi layar HP untuk acuan animasi dari bawah
const { height } = Dimensions.get("window");

export default function MatchConfirmationScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [sessionNotes, setSessionNotes] = useState("");

  // --- STATE UNTUK ANIMASI MODAL ---
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Pemicu utama
  const [showModal, setShowModal] = useState(false); // Mengatur visibilitas modal

  // 🌟 Posisikan kontainer di luar layar bawah pada awalnya (sebesar 'height')
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (isPopupOpen) {
      setShowModal(true); // Munculkan background hitam perlahan (fade)

      // 🌟 Tarik kontainer dari bawah (height) ke atas (0)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 🌟 Luncurkan kembali kontainer ke bawah (height) sebelum ditutup
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false); // Setelah kontainer di bawah, hilangkan background hitam
      });
    }
  }, [isPopupOpen, slideAnim]);

  // --- DATA DUMMY ---
  const [companionData] = useState({
    photoURL: "https://i.pravatar.cc/400?img=47",
    name_companion: "Sarah",
    age_companion: 24,
  });

  const [bookingData] = useState({
    activity_name: "Nongkrong",
    activity_type: "Casual hangout",
    location_name: "Cafe Senopati",
    location_address: "Jl. Senopati No. 12, Jakarta Selatan",
    date: "2026-07-25",
    time: "16:00 - 18:00",
    total_price: 150000,
  });

  const formatRupiah = (angka: number = 0) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const formatDateString = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: theme.colors.primaryBackground },
      ]}
    >
      <SecondaryLayout title="Konfirmasi Companion Kamu" alignLeft={true}>
        {/* --- Profile Card --- */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: companionData.photoURL }}
            style={styles.profileImage}
          />
          <Text
            style={[styles.profileName, { color: theme.colors.textPrimary }]}
          >
            {companionData.name_companion}, {companionData.age_companion}
          </Text>
          <View style={styles.verifiedBadge}>
            <IconVerifiedSafety width={12} height={12} />
            <Text style={styles.verifiedText}>VERIFIED COMPANION</Text>
          </View>
        </View>

        {/* --- Activity Summary --- */}
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          Activity Summary
        </Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: `${theme.colors.primary}15` },
              ]}
            >
              <IconCoffe width={20} height={20} color={theme.colors.primary} />
            </View>
            <View style={styles.itemText}>
              <Text
                style={[styles.itemTitle, { color: theme.colors.textPrimary }]}
              >
                {bookingData.activity_name}
              </Text>
              <Text
                style={[
                  styles.itemSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {bookingData.activity_type}
              </Text>
            </View>
          </View>

          <View
            style={[styles.divider, { borderTopColor: theme.colors.border }]}
          />

          <View style={styles.summaryItem}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: `${theme.colors.primary}15` },
              ]}
            >
              <IconLocation
                width={20}
                height={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.itemText}>
              <Text
                style={[styles.itemTitle, { color: theme.colors.textPrimary }]}
              >
                {bookingData.location_name}
              </Text>
              <Text
                style={[
                  styles.itemSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {bookingData.location_address}
              </Text>
            </View>
          </View>

          <View
            style={[styles.divider, { borderTopColor: theme.colors.border }]}
          />

          <View style={styles.summaryItem}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: `${theme.colors.primary}15` },
              ]}
            >
              <IconDate width={18} height={18} color={theme.colors.primary} />
            </View>
            <View style={styles.itemText}>
              <Text
                style={[styles.itemTitle, { color: theme.colors.textPrimary }]}
              >
                {formatDateString(bookingData.date)}
              </Text>
              <Text
                style={[
                  styles.itemSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {bookingData.time} (2 Hours)
              </Text>
            </View>
          </View>

          <View
            style={[styles.divider, { borderTopColor: theme.colors.border }]}
          />

          <View
            style={[
              styles.mapPlaceholder,
              { backgroundColor: theme.colors.primaryBackground },
            ]}
          >
            <Text
              style={[
                styles.mapPlaceholderText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Peta Lokasi Tersedia
            </Text>
          </View>
        </View>

        {/* --- Session Notes --- */}
        <Text
          style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          Session Notes
        </Text>
        <View
          style={[styles.notesContainer, { borderColor: theme.colors.border }]}
        >
          <TextInput
            style={[styles.notesInput, { color: theme.colors.textPrimary }]}
            placeholderTextColor={theme.colors.textSecondary}
            placeholder={`Add any specific topics, goals, or preferences for ${companionData.name_companion}...`}
            multiline={true}
            value={sessionNotes}
            onChangeText={setSessionNotes}
            textAlignVertical="top"
          />
        </View>
        <Text
          style={[styles.helperText, { color: theme.colors.textSecondary }]}
        >
          Optional: Help {companionData.name_companion} prepare for your
          session.
        </Text>

        {/* --- Safety Banner --- */}
        <View
          style={[
            styles.safetyBanner,
            {
              backgroundColor: `${theme.colors.primary}05`,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <IconVerifiedSafety
            width={16}
            height={16}
            color={theme.colors.primary}
            style={styles.safetyIcon}
          />
          <View style={styles.safetyTextContainer}>
            <Text
              style={[styles.safetyTitle, { color: theme.colors.textPrimary }]}
            >
              TemanZiro Safety Guaranteed
            </Text>
            <Text
              style={[styles.safetyDesc, { color: theme.colors.textSecondary }]}
            >
              Your session is secured. We keep your contact details private
              until the session is confirmed. SOS support is available in-app.
            </Text>
          </View>
        </View>

        {/* --- Pricing Section --- */}
        <View style={styles.pricingSection}>
          <View
            style={[
              styles.totalRow,
              { borderTopColor: `${theme.colors.border}50` },
            ]}
          >
            <Text
              style={[styles.totalLabel, { color: theme.colors.textPrimary }]}
            >
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
              {formatRupiah(bookingData.total_price)}
            </Text>
          </View>
        </View>
      </SecondaryLayout>

      {/* --- Footer Fixed --- */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.colors.primaryBackground },
        ]}
      >
        <GeneralButton
          variant="primary"
          style={styles.buttonAction}
          onClick={() => setIsPopupOpen(true)}
        >
          <View style={styles.buttonContentRow}>
            <IconPay width={20} height={20} color="#FFF" />
            <Text style={styles.buttonActionText}>Konfirmasi Pesan & Sesi</Text>
          </View>
        </GeneralButton>
        <GeneralButton
          variant="ghost"
          style={styles.buttonBack}
          textStyle={{ color: theme.colors.textSecondary, fontWeight: "500" }}
          onClick={() => router.back()}
        >
          Kembali ke Profil Companion
        </GeneralButton>
      </View>

      {/* --- Bottom Sheet Modal --- */}
      <Modal
        animationType="fade" // Background hitam muncul memudar (fade)
        transparent={true}
        visible={showModal}
        onRequestClose={() => setIsPopupOpen(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setIsPopupOpen(false)}
          />

          {/* 🌟 Gunakan Animated.View untuk Kontainer Putihnya */}
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                backgroundColor: theme.colors.primaryBackground,
                transform: [{ translateY: slideAnim }], // 🌟 Bergerak naik dari bawah
              },
            ]}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.popupContent}>
              <Image
                source={PaymentZiro as any}
                style={styles.paymentImage}
                resizeMode="contain"
              />
              <View style={styles.popupDesc}>
                <Text style={styles.popupTitle}>Pembayaran</Text>

                <Text
                  style={[
                    styles.popupLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Kode Pembayaran
                </Text>
                <View style={styles.valueRow}>
                  <Text
                    style={[styles.valueText, { color: theme.colors.primary }]}
                  >
                    drftgyhjkjhgfdfghj
                  </Text>
                  <IconCopy width={16} height={16} />
                </View>

                <Text
                  style={[
                    styles.popupLabel,
                    { color: theme.colors.textSecondary, marginTop: 15 },
                  ]}
                >
                  Total Pembayaran
                </Text>
                <View style={styles.valueRow}>
                  <Text
                    style={[
                      styles.valueTotalText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {formatRupiah(bookingData.total_price)}
                  </Text>
                </View>
              </View>
            </View>

            <GeneralButton
              variant="primary"
              style={styles.popupButton}
              onClick={() => setIsPopupOpen(false)}
            >
              Sudah Bayar
            </GeneralButton>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
