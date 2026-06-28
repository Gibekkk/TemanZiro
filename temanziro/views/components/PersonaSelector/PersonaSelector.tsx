import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import MinatIcon from "@/assets/icon/minat.svg";

import styles from "./PersonaSelector.style";

interface MinatProps {
  value?: string[];
  onMinatChange?: (selected: string[]) => void;
  onNewPreferencesChange?: (newPrefs: string[]) => void;
  showAddButton?: boolean;
  preference_data?: string[];
}

export default function PersonaSelector({
  value = [],
  onMinatChange,
  onNewPreferencesChange,
  showAddButton = true,
  preference_data = [],
}: MinatProps) {
  const { theme } = useTheme();

  const [selectedMinat, setSelectedMinat] = useState<string[]>(value);
  const [localNewPrefs, setLocalNewPrefs] = useState<string[]>([]);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const allPreferences = Array.from(
    new Set([...preference_data, ...localNewPrefs, ...selectedMinat])
  );

  useEffect(() => {
    setSelectedMinat(value);
  }, [value]);

  const handleToggleMinat = (minat: string) => {
    let newData: string[];
    if (selectedMinat.includes(minat)) {
      newData = selectedMinat.filter((item) => item !== minat);
    } else {
      newData = [...selectedMinat, minat];
    }
    setSelectedMinat(newData);
    if (onMinatChange) onMinatChange(newData);
  };

  const handleSimpanCustomMinat = () => {
    const teksBaru = customInputValue.trim();
    setErrorMessage("");

    if (!teksBaru) {
      setIsAddingMode(false);
      return;
    }

    if (allPreferences.includes(teksBaru)) {
      setErrorMessage("Minat sudah ada di daftar.");
      return;
    }

    const updatedNewPrefs = [...localNewPrefs, teksBaru];
    setLocalNewPrefs(updatedNewPrefs);

    if (onNewPreferencesChange) onNewPreferencesChange(updatedNewPrefs);

    handleToggleMinat(teksBaru);
    setCustomInputValue("");
    setIsAddingMode(false);
  };

  return (
    <View style={styles.minatComponent}>
      <View style={styles.header}>
        <MinatIcon width={18} height={18} style={styles.icon} />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Kamu orangnya kayak gimana?
        </Text>
      </View>

      <View style={styles.content}>
        {allPreferences.map((minat) => {
          const isActive = selectedMinat.includes(minat);
          return (
            <TouchableOpacity
              key={minat}
              onPress={() => handleToggleMinat(minat)}
              style={[
                styles.capsule,
                isActive
                  ? { backgroundColor: theme.colors.secondary, borderColor: theme.colors.secondary }
                  : { backgroundColor: `${theme.colors.secondaryBackground}40`, borderColor: theme.colors.border },
              ]}
            >
              <Text
                style={[
                  styles.capsuleText,
                  { color: isActive ? theme.colors.lightText : theme.colors.secondary },
                ]}
              >
                {minat}
              </Text>
            </TouchableOpacity>
          );
        })}

        {showAddButton && (
          isAddingMode ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.customInput, { borderColor: theme.colors.secondary, color: theme.colors.secondary }]}
                placeholder="Ketik lalu Enter..."
                placeholderTextColor={theme.colors.textPrimary}
                value={customInputValue}
                onChangeText={setCustomInputValue}
                onSubmitEditing={handleSimpanCustomMinat}
                onBlur={handleSimpanCustomMinat}
                autoFocus
              />
              {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.capsuleAdd, { borderColor: theme.colors.secondary }]}
              onPress={() => setIsAddingMode(true)}
            >
              <Text style={[styles.capsuleText, { color: theme.colors.secondary }]}>+ Tambah</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}