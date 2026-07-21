import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import CalendarIcon from "@/assets/icon/date.svg";
import styles from "./DatePicker.style";

interface DateInfo {
  date: string; // Format: YYYY-MM-DD
  day: string; // Nama hari: Monday, Tuesday, etc
}

interface DatePickerProps {
  onRangeSelect?: (
    startDate: DateInfo | null,
    endDate: DateInfo | null,
  ) => void;
}

type ViewMode = "day" | "month" | "year";

export default function DatePicker({ onRangeSelect }: DatePickerProps) {
  const { theme } = useTheme();

  const [viewDate, setViewDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("day");

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- LOGIKA HELPER ---
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateWithDay = (date: Date | null): DateInfo | null => {
    if (!date) return null;
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return {
      date: formatDate(date),
      day: dayNames[date.getDay()],
    };
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // --- HANDLER EVENT ---
  const handleDateClick = (clickedDate: Date) => {
    const clicked = new Date(clickedDate);
    clicked.setHours(0, 0, 0, 0);

    if (clicked < today) return;

    if (startDate && endDate) {
      setStartDate(clickedDate);
      setEndDate(null);
      if (onRangeSelect) onRangeSelect(formatDateWithDay(clickedDate), null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
        if (onRangeSelect)
          onRangeSelect(
            formatDateWithDay(clickedDate),
            formatDateWithDay(startDate),
          );
      } else {
        setEndDate(clickedDate);
        if (onRangeSelect)
          onRangeSelect(
            formatDateWithDay(startDate),
            formatDateWithDay(clickedDate),
          );
      }
    } else {
      setStartDate(clickedDate);
      setEndDate(null);
      if (onRangeSelect) onRangeSelect(formatDateWithDay(clickedDate), null);
    }
  };

  const handlePrevNext = (direction: -1 | 1) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    if (viewMode === "day") {
      setViewDate(new Date(year, month + direction, 1));
    } else if (viewMode === "month") {
      setViewDate(new Date(year + direction, month, 1));
    } else if (viewMode === "year") {
      setViewDate(new Date(year + direction * 12, month, 1));
    }
  };

  // --- GENERATOR DATA CALENDAR ---
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  };

  const getYears = () => {
    const currentYear = viewDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10 - 1;
    return Array.from({ length: 12 }, (_, i) => startYear + i);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <CalendarIcon width={24} height={24} />
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.primary || "#0F172A" },
          ]}
        >
          Pilih Tanggal & Hari
        </Text>
      </View>

      {/* CARD CALENDAR */}
      <View style={styles.card}>
        {/* NAVIGASI & MODE SELECTOR */}
        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => handlePrevNext(-1)}
          >
            <Text style={styles.navIconText}>{"<"}</Text>
          </TouchableOpacity>

          <View style={styles.selectors}>
            <TouchableOpacity
              style={[
                styles.modeSelector,
                viewMode === "month" && styles.activeMode,
              ]}
              onPress={() =>
                setViewMode(viewMode === "month" ? "day" : "month")
              }
            >
              <Text
                style={[
                  styles.modeSelectorText,
                  viewMode === "month" && styles.activeModeText,
                ]}
              >
                {monthNames[viewDate.getMonth()]}{" "}
                {/* 👇 Bungkus ikon panah dengan Text dan berikan style baru */}
                <Text style={styles.arrowIcon}>
                  {viewMode === "month" ? "▲" : "▼"}
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeSelector,
                viewMode === "year" && styles.activeMode,
              ]}
              onPress={() => setViewMode(viewMode === "year" ? "day" : "year")}
            >
              <Text
                style={[
                  styles.modeSelectorText,
                  viewMode === "year" && styles.activeModeText,
                ]}
              >
                {viewDate.getFullYear()}{" "}
                {/* 👇 Bungkus ikon panah dengan Text dan berikan style baru */}
                <Text style={styles.arrowIcon}>
                  {viewMode === "year" ? "▲" : "▼"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => handlePrevNext(1)}
          >
            <Text style={styles.navIconText}>{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* VIEW MODE: DAY (HARI) */}
        {viewMode === "day" && (
          <View>
            <View style={styles.gridDayName}>
              {daysOfWeek.map((day) => (
                <View key={day} style={styles.dayNameCell}>
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.gridDays}>
              {getCalendarDays().map((item, index) => {
                const dateObj = item.date;
                dateObj.setHours(0, 0, 0, 0);
                const isToday = isSameDay(dateObj, today);
                const isStart = startDate
                  ? isSameDay(dateObj, startDate)
                  : false;
                const isEnd = endDate ? isSameDay(dateObj, endDate) : false;
                const isInRange =
                  startDate &&
                  endDate &&
                  dateObj > startDate &&
                  dateObj < endDate;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => handleDateClick(dateObj)}
                    style={[
                      styles.dayCell,
                      isToday && !isStart && !isEnd && styles.today,
                      isInRange && styles.inRange,
                      (isStart || isEnd) && styles.selected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayCellText,
                        !item.isCurrentMonth && styles.otherMonth,
                        (isStart || isEnd) && styles.selectedText,
                        isInRange && styles.inRangeText,
                      ]}
                    >
                      {dateObj.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* VIEW MODE: MONTH (BULAN) */}
        {viewMode === "month" && (
          <View style={styles.gridList}>
            {monthNames.map((m, index) => {
              const isSelected = viewDate.getMonth() === index;
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.listCell, isSelected && styles.selected]}
                  onPress={() => {
                    setViewDate(new Date(viewDate.getFullYear(), index, 1));
                    setViewMode("day");
                  }}
                >
                  <Text
                    style={[
                      styles.listCellText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* VIEW MODE: YEAR (TAHUN) */}
        {viewMode === "year" && (
          <View style={styles.gridList}>
            {getYears().map((year) => {
              const isSelected = viewDate.getFullYear() === year;
              return (
                <TouchableOpacity
                  key={year}
                  style={[styles.listCell, isSelected && styles.selected]}
                  onPress={() => {
                    setViewDate(new Date(year, viewDate.getMonth(), 1));
                    setViewMode("month");
                  }}
                >
                  <Text
                    style={[
                      styles.listCellText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
