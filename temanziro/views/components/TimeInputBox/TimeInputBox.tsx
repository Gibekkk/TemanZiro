import React, { useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import styles from "./TimeInputBox.style";

const formatTime = (num: number) => num.toString().padStart(2, "0");

interface TimeInputBoxProps {
  value: number;
  max: number;
  isActive: boolean;
  onChange: (val: number) => void;
  onFocus: () => void;
  activeBackgroundColor: string;
  activeBorderColor: string;
  activeTextColor: string;
  inactiveBorderColor: string;
  inactiveTextColor: string;
}

const TimeInputBox = ({
  value,
  max,
  isActive,
  onChange,
  onFocus,
  activeBackgroundColor,
  activeBorderColor,
  activeTextColor,
  inactiveBorderColor,
  inactiveTextColor,
}: TimeInputBoxProps) => {
  const [tempVal, setTempVal] = useState(formatTime(value));
  const isFocusedRef = useRef(false);
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isFocusedRef.current) {
      setTempVal(formatTime(value));
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    };
  }, []);

  const commitValue = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    let num = parseInt(cleaned || "0", 10);
    num = Math.max(0, Math.min(max, num));
    onChange(num);
    setTempVal(formatTime(num));
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        onFocus();
        setTimeout(() => inputRef.current?.focus(), 50);
      }}
      style={[
        styles.container,
        isActive
          ? { backgroundColor: activeBackgroundColor, borderColor: activeBorderColor }
          : { borderColor: inactiveBorderColor },
      ]}
    >
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          isActive
            ? { color: activeTextColor }
            : { color: inactiveTextColor },
        ]}
        value={tempVal}
        keyboardType="number-pad"
        caretHidden={true}
        contextMenuHidden={true}
        selectTextOnFocus={true}
        onFocus={() => {
          isFocusedRef.current = true;
          setTempVal("");
          onFocus();
        }}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, "").slice(0, 2);
          setTempVal(cleaned);

          if (commitTimerRef.current) clearTimeout(commitTimerRef.current);

          if (cleaned.length === 2) {
            const num = parseInt(cleaned, 10);
            if (num > max) {
              const first = parseInt(cleaned[0], 10);
              onChange(first);
              setTempVal(formatTime(first));
            } else {
              onChange(num);
              setTempVal(formatTime(num));
            }
          } else {
            commitTimerRef.current = setTimeout(() => {
              commitValue(cleaned);
            }, 2000);
          }
        }}
        onBlur={() => {
          setTimeout(() => {
            isFocusedRef.current = false;
            if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
            commitValue(tempVal);
          }, 100);
        }}
      />
    </TouchableOpacity>
  );
};

export default TimeInputBox;