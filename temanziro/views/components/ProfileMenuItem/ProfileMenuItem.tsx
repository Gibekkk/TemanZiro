import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";
import styles from "./ProfileMenuItem.style"

interface ProfileMenuItemProps {
    title: string;
    icon: React.ReactNode;
    // iconBgColor: string;
    onPress: () => void;
    isLast?: boolean;
    variant?: "default" | "danger";
}

export default function ProfileMenuItem({
    title,
    icon,
    // iconBgColor,
    onPress,
    isLast = false,
    variant = "default",
}: ProfileMenuItemProps) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.leftSection}>
                <View style={[styles.iconWrapper, 
                    // { backgroundColor: iconBgColor }
                    ]}>
                    {icon}
                </View>
                <Text
                    style={[
                        styles.title,
                        variant === "danger"
                            ? { color: theme.colors.red || "#ef4444" }
                            : { color: theme.colors.textPrimary || "#0f172a" },
                    ]}
                >
                    {title}
                </Text>
            </View>
            <IconAngleRight width={20} height={20} style={styles.arrowIcon} />
        </TouchableOpacity>
    );
}
