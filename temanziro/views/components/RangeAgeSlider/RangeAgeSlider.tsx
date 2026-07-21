import React from "react";
import { View, Text, Dimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
// IconAge sudah tidak diperlukan di sini, bisa dihapus
import styles from "./RangeAgeSlider.style";
import { useTheme } from "@/controllers/hooks/useTheme";

interface AgeRangeSliderProps {
  values: number[]; 
  onAgeRangeChange: (range: number[]) => void;
}

export default function AgeRangeSlider({ values, onAgeRangeChange }: AgeRangeSliderProps) {
  const minBoundary = 18;
  const maxBoundary = 60;

  const screenWidth = Dimensions.get("window").width;
  const sliderWidth = screenWidth - 40;

    const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* ❌ HEADER SUDAH DIHAPUS DARI SINI ❌ */}

      <View style={styles.sliderWrapper}>
        <MultiSlider
          values={values}
          sliderLength={sliderWidth}
          onValuesChange={(newValues: number[]) => onAgeRangeChange(newValues)}
          min={minBoundary}
          max={maxBoundary}
          step={1}
          allowOverlap={false}
          snapped={true}
          minMarkerOverlapDistance={10}
          trackStyle={[styles.trackBg, {backgroundColor: `${theme.colors.secondary}20`}]} // Gunakan warna dari theme
          selectedStyle={[styles.trackHighlight, {backgroundColor: theme.colors.secondary}]}
          unselectedStyle={[styles.trackBg, {backgroundColor: `${theme.colors.secondary}20`}]}
          markerStyle={[styles.thumb, {backgroundColor: theme.colors.lightText, borderColor: theme.colors.secondary}]}
          pressedMarkerStyle={[styles.thumbPressed, {backgroundColor: theme.colors.lightText, borderColor: theme.colors.secondary}]}
        />

        <View style={styles.labels}>
          <Text style={[styles.labelText, { color: `${theme.colors.textPrimary}70` }]}>18</Text>
          <Text style={[styles.labelText, { color: `${theme.colors.textPrimary}70` }]}>30</Text>
          <Text style={[styles.labelText, { color: `${theme.colors.textPrimary}70` }]}>45</Text>
          <Text style={[styles.labelText, { color: `${theme.colors.textPrimary}70` }]}>60+</Text>
        </View>
      </View>
    </View>
  );
}