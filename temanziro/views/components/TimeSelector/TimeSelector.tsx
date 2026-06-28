import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";

// Gunakan path gambar sesuai dengan format yang didukung React Native (PNG/JPG)
// Jika menggunakan SVG, pastikan menggunakan react-native-svg
import IconCalendar from "@/assets/icon/date.svg";
import IconCheck from "@/assets/icon/check.svg";

import styles from "./TimeSelector.style";

export default function TimeSelector() {
  const { theme } = useTheme();

  const [selectedCategory, setSelectedCategory] =
    useState<string>("Pilih Hari");
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Senin",
    "Selasa",
  ]);

  const timeOptions = [
    "Pagi Weekdays",
    "Malam Weekday",
    "Akhir Pekan",
    "Setiap hari",
  ];

  const daysOfWeek = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  const toggleDay = (day: string) => {
    if (selectedCategory !== "Pilih Hari") setSelectedCategory("Pilih Hari");

    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <IconCalendar width={18} height={18} style={styles.headerIcon} />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Kapan kamu ada waktu?
        </Text>
      </View>

      {/* GRID OPSI WAKTU */}
      <View style={styles.grid}>
        {timeOptions.map((option) => {
          const isActive = selectedCategory === option;

          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(option)}
              style={[
                styles.timeOption,
                {
                  backgroundColor: isActive
                    ? `${theme.colors.secondaryBackground}60`
                    : theme.colors.primaryBackground,
                  borderColor: isActive
                    ? theme.colors.secondary
                    : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  { color: theme.colors.secondary },
                ]}
              >
                {option}
              </Text>

              {isActive ? (
                <IconCheck width={18} height={18} style={styles.checkIcon} />
              ) : (
                <View
                  style={[
                    styles.radioCircle,
                    { borderColor: theme.colors.border },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CUSTOM DAY CARD (PILIH HARI) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelectedCategory("Pilih Hari")}
        style={[
          styles.customDayCard,
          {
            backgroundColor:
              selectedCategory === "Pilih Hari"
                ? `${theme.colors.secondaryBackground}60`
                : theme.colors.primaryBackground,
            borderColor:
              selectedCategory === "Pilih Hari"
                ? theme.colors.secondary
                : theme.colors.border,
          },
        ]}
      >
        <View style={styles.customDayHeader}>
          <Text
            style={[
              styles.customDayHeaderText,
              { color: theme.colors.secondary },
            ]}
          >
            Pilih Hari
          </Text>
          {selectedCategory === "Pilih Hari" ? (
            <IconCheck width={18} height={18} style={styles.checkIcon} />
          ) : (
            <View
              style={[styles.radioCircle, { borderColor: theme.colors.border }]}
            />
          )}
        </View>

        {/* GRID HARI */}
        <View style={styles.daysGrid}>
          {daysOfWeek.map((day) => {
            const isActive =
              selectedCategory === "Pilih Hari" && selectedDays.includes(day);

            return (
              <TouchableOpacity
                key={day}
                activeOpacity={0.7}
                onPress={() => toggleDay(day)}
                style={[
                  styles.dayBtn,
                  {
                    backgroundColor: isActive
                      ? theme.colors.secondary
                      : theme.colors.secondaryBackground,
                    borderColor: isActive
                      ? theme.colors.secondary
                      : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayBtnText,
                    {
                      color: isActive
                        ? theme.colors.lightText
                        : theme.colors.secondary,
                    },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </View>
  );
}
