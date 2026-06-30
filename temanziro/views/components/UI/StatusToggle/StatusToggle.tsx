import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import styles from "./StatusToggle.style";

interface StatusToggleProps {
  isActive?: boolean;
  onToggle?: (value: boolean) => void;
}

export default function StatusToggle({ isActive: propIsActive, onToggle }: StatusToggleProps) {
    const { theme, isDark } = useTheme();

    const cardBg = isDark ? "#1a1613" : "#f8efea";
    const cardBorder = isDark ? "#382920" : "#f0dfd7";

    const [localIsActive, setLocalIsActive] = useState(true);

    const isActive = propIsActive !== undefined ? propIsActive : localIsActive;

    const animatedValue = useRef(new Animated.Value(isActive ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
        }).start();
    }, [isActive]);

    const handleToggle = () => {
        const nextState = !isActive;
        if (onToggle) {
        onToggle(nextState);
        } else {
        setLocalIsActive(nextState);
        }
    };

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
    });

    return (
        <View style={[styles.container, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.leftSection}>
            <Text style={[styles.statusText, { color: theme.colors.textPrimary }]}>Status</Text>
            <View style={styles.activeWrapper}>
            <Text style={[styles.activeText, { color: isActive ? theme.colors.online : theme.colors.textSecondary }]}>
                {isActive ? "Active" : "Inactive"}
            </Text>
            <View style={[styles.dot, { backgroundColor: isActive ? theme.colors.online : "#94a3b8" }]} />
            </View>
        </View>
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggle}
            style={[
            styles.switchTrack,
            { backgroundColor: isActive ? theme.colors.secondary : "#cbd5e1" },
            ]}
        >
            <Animated.View style={[styles.switchThumb, { transform: [{ translateX }] }]} />
        </TouchableOpacity>
        </View>
    );
}
