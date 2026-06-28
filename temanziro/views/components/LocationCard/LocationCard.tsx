import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import LogoLocation from "@/assets/icon/location.svg";
import LogoSearch from "@/assets/icon/search.svg";

import styles from "./LocationCard.style";

interface LocationCardProps {
  title: string;
  label: string;
  cities?: string[];
  onValueChange?: (value: string) => void;
  value?: string;
}

export default function LocationCard({
  title,
  label,
  cities = [],
  onValueChange,
  value = "",
}: LocationCardProps) {
  const { theme } = useTheme();
  const [searchValue, setSearchValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (city: string) => {
    setSearchValue(city);
    setShowDropdown(false);
    if (onValueChange) {
      onValueChange(city);
    }
  };

  return (
    <View style={[styles.containerLocation, { backgroundColor: `${theme.colors.secondaryBackground}40`, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <LogoLocation width={18} height={18} style={styles.icon} />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      </View>

      <View style={[styles.searchBar, { backgroundColor: theme.colors.primaryBackground, borderColor: theme.colors.border }]}>
        <TextInput
          style={[styles.inputField, { color: theme.colors.textPrimary }]}
          placeholder={label}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchValue}
          onChangeText={(text) => {
            setSearchValue(text);
            setShowDropdown(true);
            if (onValueChange) onValueChange(text);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        <LogoSearch width={18} height={18} style={styles.icon} />
      </View>

      {showDropdown && filteredCities.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: theme.colors.primaryBackground, borderColor: theme.colors.border }]}>
          <FlatList
            data={filteredCities}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled={true}
            style={styles.dropdownList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dropdownItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => handleSelect(item)}
              >
                <Text style={{ color: theme.colors.textPrimary }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}