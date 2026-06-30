import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";

import { ACTIVITY_TYPE } from "@/constants/BookingDetails";
import IconClipboard from "@/assets/icon/bidang.svg";
import IconNongkrongOrange from "@/assets/icon/nongkrongorange.svg";
import IconNongkrongWhite from "@/assets/icon/Vector.svg";
import IconJalanOrange from "@/assets/icon/belanjaorange.svg";
import IconJalanWhite from "@/assets/icon/belanjawhite.svg";
import IconBelajarOrange from "@/assets/icon/belajarorange.svg";
import IconBelajarWhite from "@/assets/icon/belajarwhite.svg";
import IconOlahragaOrange from "@/assets/icon/olahragaorange.svg";
import IconOlahragaWhite from "@/assets/icon/Vector-1.svg";
import IconKulinerOrange from "@/assets/icon/kulinerorange.svg";
import IconKulinerWhite from "@/assets/icon/kulinerwhite.svg";
import IconHiburanOrange from "@/assets/icon/hiburanorange.svg";
import IconHiburanWhite from "@/assets/icon/hiburanwhite.svg";

import styles from "./InterestSelector.style";

interface InterestProps {
  value?: string[];
  onChange?: (selected: string[]) => void;
  interests?: string[];
  disabled?: boolean;
  showHeader?: boolean;
}

const INTEREST_ICONS: Record<string, { orange: any; white: any }> = {
  nongkrong: { orange: IconNongkrongOrange, white: IconNongkrongWhite },
  jalan: { orange: IconJalanOrange, white: IconJalanWhite },
  belajar: { orange: IconBelajarOrange, white: IconBelajarWhite },
  olahraga: { orange: IconOlahragaOrange, white: IconOlahragaWhite },
  kuliner: { orange: IconKulinerOrange, white: IconKulinerWhite },
  hiburan: { orange: IconHiburanOrange, white: IconHiburanWhite },
};

const DEFAULT_INTERESTS = ACTIVITY_TYPE.map((act) => act.title);

export default function InterestSelector({
  value = [],
  onChange,
  interests = DEFAULT_INTERESTS,
  disabled = false,
  showHeader = true,
}: InterestProps) {
  const { theme } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(value);

  const defaultInterests = ACTIVITY_TYPE.map((act) => {
    const icons = INTEREST_ICONS[act.value] || { orange: IconNongkrongOrange, white: IconNongkrongWhite };
    return {
      label: act.title,
      value: act.value,
      iconOrange: icons.orange,
      iconWhite: icons.white,
    };
  });

  const interestData = interests.map((labelOrValue) => {
    const defaultItem = defaultInterests.find(
      (item) =>
        item.label.toLowerCase() === labelOrValue.toLowerCase() ||
        item.value.toLowerCase() === labelOrValue.toLowerCase()
    );
    return defaultItem || {
      label: labelOrValue,
      value: labelOrValue.toLowerCase(),
      iconOrange: IconNongkrongOrange,
      iconWhite: IconNongkrongWhite,
    };
  });

  useEffect(() => {
    setSelectedInterests(value);
  }, [value]);

  const toggleInterest = (interest: string) => {
    const newSelected = selectedInterests.includes(interest)
      ? selectedInterests.filter((item) => item !== interest)
      : [...selectedInterests, interest];

    setSelectedInterests(newSelected);
    if (onChange) onChange(newSelected);
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <IconClipboard width={18} height={18} style={styles.headerIcon} />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Kamu minat di bidang apa?</Text>
        </View>
      )}

      <View style={styles.grid}>
        {interestData.map((item) => {
          const isActive = selectedInterests.includes(item.label);

          const IconComponent = isActive ? item.iconWhite : item.iconOrange;

          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => toggleInterest(item.label)}
              disabled={disabled}
              activeOpacity={disabled ? 1 : 0.7}
              style={[
                styles.button,
                {
                  backgroundColor: isActive ? theme.colors.secondary : `${theme.colors.secondaryBackground}40`,
                  borderColor: isActive ? theme.colors.secondary : theme.colors.border
                },
              ]}
            >
              <IconComponent width={20} height={20} style={styles.icon} />
              <Text
                style={[
                  styles.buttonText,
                  { color: isActive ? theme.colors.lightText : theme.colors.secondary },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}