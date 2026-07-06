import React, { useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import IconSearch from "@/assets/icon/searchorange.svg";
import { styles } from "./SearchBar.style";
import { COMMON_COLORS } from "@/constants/Theme";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (text: string) => void;
  minLength?: number;
  delay?: number;
}

export default function SearchBar({
  placeholder = "Cari Percakapan",
  onSearch,
  minLength = 4,
  delay = 500,
}: SearchBarProps) {
  const [localText, setLocalText] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localText.length >= minLength || localText.length === 0) {
        onSearch(localText);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [localText, minLength, delay, onSearch]);

  return (
    <View style={styles.searchBar}>
      <IconSearch width={20} height={20} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={COMMON_COLORS.textSecondary}
        value={localText}
        onChangeText={setLocalText}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}
