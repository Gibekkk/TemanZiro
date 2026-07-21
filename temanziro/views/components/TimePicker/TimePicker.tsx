import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ViewStyle, Keyboard } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import ClockIcon from "@/assets/icon/time.svg";

import styles from "./TimePicker.style";
import TimeInputBox from "@/views/components/TimeInputBox/TimeInputBox";
import WheelColumn from "@/views/components/WheelColumn/WheelColumn";

interface TimeSelectionProps {
  style?: ViewStyle;
  value?: string; // Format: "HH:MM-HH:MM"
  onTimeChange?: (data: {
    mode: string;
    startTime: string;
    endTime: string;
  }) => void;
}

export default function TimeSelection({
  value,
  style,
  onTimeChange,
}: TimeSelectionProps) {
  const { theme } = useTheme();

  const [selectedMode, setSelectedMode] = useState<"standard" | "fullday">(
    "standard",
  );
  const [start, setStart] = useState({ h: 12, m: 0 });
  const [end, setEnd] = useState({ h: 14, m: 0 });

  useEffect(() => {
    if (value) {
      if (value === "00:00-23:59") {
        if (selectedMode !== "fullday") {
          setSelectedMode("fullday");
        }
      } else {
        const parts = value.split("-");
        if (parts.length === 2) {
          const [sh, sm] = parts[0].split(":").map(Number);
          const [eh, em] = parts[1].split(":").map(Number);
          if (!isNaN(sh) && !isNaN(sm) && (start.h !== sh || start.m !== sm)) {
            setStart({ h: sh, m: sm });
          }
          if (!isNaN(eh) && !isNaN(em) && (end.h !== eh || end.m !== em)) {
            setEnd({ h: eh, m: em });
          }
          if (selectedMode !== "standard") {
            setSelectedMode("standard");
          }
        }
      }
    }
  }, [value]);
  const [activeField, setActiveField] = useState<"start" | "end" | null>(null);

  const toTotalMinutes = (h: number, m: number) => h * 60 + m;

  const handleStartChange = (newH: number, newM: number) => {
    setStart({ h: newH, m: newM });
    const newStartTotal = toTotalMinutes(newH, newM);
    const endTotal = toTotalMinutes(end.h, end.m);
    if (newStartTotal > endTotal) {
      const finalEnd = Math.min(newStartTotal + 60, 1439);
      setEnd({ h: Math.floor(finalEnd / 60), m: finalEnd % 60 });
    }
  };

  const handleEndChange = (newH: number, newM: number) => {
    setEnd({ h: newH, m: newM });
    const newEndTotal = toTotalMinutes(newH, newM);
    const startTotal = toTotalMinutes(start.h, start.m);
    if (newEndTotal < startTotal) {
      const adjustedStart = Math.max(0, newEndTotal - 60);
      setStart({ h: Math.floor(adjustedStart / 60), m: adjustedStart % 60 });
    }
  };

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  useEffect(() => {
    if (onTimeChange) {
      if (selectedMode === "fullday") {
        onTimeChange({ mode: "fullday", startTime: "00:00", endTime: "23:59" });
      } else {
        onTimeChange({
          mode: "standard",
          startTime: `${formatTime(start.h)}:${formatTime(start.m)}`,
          endTime: `${formatTime(end.h)}:${formatTime(end.m)}`,
        });
      }
    }
  }, [selectedMode, start, end]);

  const renderRadio = (isActive: boolean) => (
    <View
      style={[
        styles.radioOuter,
        {
          borderColor: isActive ? theme.colors.secondary : theme.colors.border,
        },
        isActive && { backgroundColor: theme.colors.secondary },
      ]}
    >
      {isActive && (
        <View
          style={[
            styles.radioInner,
            { backgroundColor: theme.colors.lightText },
          ]}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mainHeader}>
        <ClockIcon width={18} height={18} style={styles.headerIcon} />
        <Text style={[styles.mainTitle, { color: theme.colors.textPrimary }]}>
          Pilih waktumu
        </Text>
      </View>

      {/* --- OPSI 1: STANDARD --- */}
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              selectedMode === "standard"
                ? `${theme.colors.secondaryBackground}40`
                : theme.colors.primaryBackground,
            borderColor:
              selectedMode === "standard"
                ? theme.colors.secondary
                : theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cardHeader}
          onPress={() => {
            setSelectedMode("standard");
            if (activeField === null) setActiveField("start");
          }}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Standard (Pilih Jam)
          </Text>
          {renderRadio(selectedMode === "standard")}
        </TouchableOpacity>

        {selectedMode === "standard" && (
          <View style={styles.expandedContent}>
            {/* WAKTU MULAI */}
            <View
              style={[
                styles.timeDisplayRow,
                activeField === "start"
                  ? {
                      backgroundColor: theme.colors.lightText,
                      borderColor: theme.colors.border,
                    }
                  : { borderColor: "transparent" },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.timeLabel,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Waktu Mulai
                </Text>
                <Text
                  style={[
                    styles.timeSubLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Waktu Dimulai
                </Text>
              </View>
              <View style={styles.timeBoxWrapper}>
                <TimeInputBox
                  value={start.h}
                  max={23}
                  isActive={activeField === "start"}
                  onFocus={() => setActiveField("start")}
                  onChange={(v) => handleStartChange(v, start.m)}
                  activeBackgroundColor={theme.colors.secondaryBackground}
                  activeBorderColor={theme.colors.secondary}
                  activeTextColor={theme.colors.secondary}
                  inactiveBorderColor={theme.colors.textSecondary}
                  inactiveTextColor={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.timeSeparator,
                    activeField === "start"
                      ? { color: theme.colors.secondary }
                      : { color: theme.colors.textSecondary },
                  ]}
                >
                  :
                </Text>
                <TimeInputBox
                  value={start.m}
                  max={59}
                  isActive={activeField === "start"}
                  onFocus={() => setActiveField("start")}
                  onChange={(v) => handleStartChange(start.h, v)}
                  activeBackgroundColor={theme.colors.secondaryBackground}
                  activeBorderColor={theme.colors.secondary}
                  activeTextColor={theme.colors.secondary}
                  inactiveBorderColor={theme.colors.textSecondary}
                  inactiveTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            {/* PICKER WAKTU MULAI */}
            {activeField === "start" && (
              <View
                style={[
                  styles.pickerWrapper,
                  {
                    backgroundColor: theme.colors.lightText,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View
                  pointerEvents="none"
                  style={[
                    styles.pickerHighlightBar,
                    {
                      backgroundColor: theme.colors.secondaryBackground,
                      borderTopColor: theme.colors.secondary,
                      borderBottomColor: theme.colors.secondary,
                    },
                  ]}
                />
                <WheelColumn
                  value={start.h}
                  max={23}
                  onChange={(v) => handleStartChange(v, start.m)}
                  activeColor={theme.colors.secondary}
                  textColor={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.pickerSeparatorText,
                    { color: theme.colors.secondary },
                  ]}
                >
                  :
                </Text>
                <WheelColumn
                  value={start.m}
                  max={59}
                  onChange={(v) => handleStartChange(start.h, v)}
                  activeColor={theme.colors.secondary}
                  textColor={theme.colors.textSecondary}
                />
              </View>
            )}

            {/* WAKTU BERAKHIR */}
            <View
              style={[
                styles.timeDisplayRow,
                activeField === "end"
                  ? {
                      backgroundColor: theme.colors.lightText,
                      borderColor: theme.colors.border,
                    }
                  : { borderColor: "transparent" },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.timeLabel,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Waktu Berakhir
                </Text>
                <Text
                  style={[
                    styles.timeSubLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Batas Waktu
                </Text>
              </View>
              <View style={styles.timeBoxWrapper}>
                <TimeInputBox
                  value={end.h}
                  max={23}
                  isActive={activeField === "end"}
                  onFocus={() => setActiveField("end")}
                  onChange={(v) => handleEndChange(v, end.m)}
                  activeBackgroundColor={theme.colors.secondaryBackground}
                  activeBorderColor={theme.colors.secondary}
                  activeTextColor={theme.colors.secondary}
                  inactiveBorderColor={theme.colors.textSecondary}
                  inactiveTextColor={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.timeSeparator,
                    activeField === "end"
                      ? { color: theme.colors.secondary }
                      : { color: theme.colors.textSecondary },
                  ]}
                >
                  :
                </Text>
                <TimeInputBox
                  value={end.m}
                  max={59}
                  isActive={activeField === "end"}
                  onFocus={() => setActiveField("end")}
                  onChange={(v) => handleEndChange(end.h, v)}
                  activeBackgroundColor={theme.colors.secondaryBackground}
                  activeBorderColor={theme.colors.secondary}
                  activeTextColor={theme.colors.secondary}
                  inactiveBorderColor={theme.colors.textSecondary}
                  inactiveTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            {/* PICKER WAKTU BERAKHIR */}
            {activeField === "end" && (
              <View
                style={[
                  styles.pickerWrapper,
                  {
                    backgroundColor: theme.colors.lightText,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View
                  pointerEvents="none"
                  style={[
                    styles.pickerHighlightBar,
                    {
                      backgroundColor: theme.colors.secondaryBackground,
                      borderTopColor: theme.colors.secondary,
                      borderBottomColor: theme.colors.secondary,
                    },
                  ]}
                />
                <WheelColumn
                  value={end.h}
                  max={23}
                  onChange={(v) => handleEndChange(v, end.m)}
                  activeColor={theme.colors.secondary}
                  textColor={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.pickerSeparatorText,
                    { color: theme.colors.secondary },
                  ]}
                >
                  :
                </Text>
                <WheelColumn
                  value={end.m}
                  max={59}
                  onChange={(v) => handleEndChange(end.h, v)}
                  activeColor={theme.colors.secondary}
                  textColor={theme.colors.textSecondary}
                />
              </View>
            )}
          </View>
        )}
      </View>

      {/* --- OPSI 2: FULL DAY --- */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          {
            backgroundColor:
              selectedMode === "fullday"
                ? `${theme.colors.secondaryBackground}40`
                : theme.colors.primaryBackground,
            borderColor:
              selectedMode === "fullday"
                ? theme.colors.secondary
                : theme.colors.border,
          },
        ]}
        onPress={() => {
          setSelectedMode("fullday");
          setActiveField(null);
          Keyboard.dismiss();
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Full Day (24 Jam)
          </Text>
          {renderRadio(selectedMode === "fullday")}
        </View>
      </TouchableOpacity>
    </View>
  );
}
