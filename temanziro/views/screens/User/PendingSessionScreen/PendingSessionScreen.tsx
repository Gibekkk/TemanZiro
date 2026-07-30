import React from "react";
import { View, Text, Image, TextInput, ScrollView } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";

import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";

import IconLocation from "@/assets/icon/location.svg";
import IconDate from "@/assets/icon/date.svg";
import IconCoffe from "@/assets/icon/coffe.svg";

import styles from "./PendingSessionScreen.style";

export default function DetailPendScreen() {
  const { theme } = useTheme();

  const profileAvatar = "https://i.pravatar.cc/150?img=5";

  return (
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: theme.colors.secondaryBackground },
      ]}
    >
      <SecondaryLayout title="Info Pemesanan" alignLeft={true} noShadow={true}>
        <View
          style={[
            styles.cardContainer,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.primary,
            },
          ]}
        >
          {/* --- HEADER --- */}
          <View style={styles.headerSection}>
            <Image source={{ uri: profileAvatar }} style={styles.avatar} />
            <Text style={[styles.statusText, { color: theme.colors.primary }]}>
              Menunggu Pembayaran
            </Text>
          </View>

          {/* --- PAYMENT DETAILS --- */}
          <View style={styles.paymentSection}>
            <View style={styles.paymentRow}>
              <Text
                style={[styles.totalValue, { color: theme.colors.primary }]}
              >
                Rp.70.000
              </Text>
              <Text
                style={[
                  styles.paymentLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Pembayaran
              </Text>
            </View>
          </View>

          <View
            style={[styles.divider, { borderTopColor: theme.colors.border }]}
          />

          {/* --- ACTIVITY DETAILS --- */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: `${theme.colors.primary}15` },
                ]}
              >
                <IconCoffe
                  width={20}
                  height={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.itemText}>
                <Text
                  style={[
                    styles.itemTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Cafe & Chill
                </Text>
                <Text
                  style={[
                    styles.itemSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Activity Type
                </Text>
              </View>
            </View>

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
                  style={[
                    styles.itemTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Central Park Mall
                </Text>
                <Text
                  style={[
                    styles.itemSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Location
                </Text>
              </View>
            </View>

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
                  style={[
                    styles.itemTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Tomorrow, 14 Sept
                </Text>
                <Text
                  style={[
                    styles.itemSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  16:00 - 18:00 (2 Hours)
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.mapPlaceholder,
                { backgroundColor: theme.colors.secondaryBackground },
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

          <View
            style={[
              styles.divider,
              { borderTopColor: theme.colors.border, marginBottom: 16 },
            ]}
          />

          {/* --- SESSION NOTES --- */}
          <View style={styles.notesSection}>
            <Text
              style={[styles.notesTitle, { color: theme.colors.textPrimary }]}
            >
              Session Notes
            </Text>
            <TextInput
              style={[
                styles.notesTextarea,
                {
                  color: theme.colors.textSecondary,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.secondaryBackground,
                },
              ]}
              multiline={true}
              editable={false}
              textAlignVertical="top"
              value="Add any specific topics, goals, or preferences for Sarah..."
            />
          </View>
        </View>
      </SecondaryLayout>
    </View>
  );
}
