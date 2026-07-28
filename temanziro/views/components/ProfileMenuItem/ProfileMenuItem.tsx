import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";
import styles from "./ProfileMenuItem.style"

interface ProfileMenuItemProps {
    title: React.ReactNode;
    icon: React.ReactNode;
    iconBgColor?: string;
    onPress?: () => void;
    isLast?: boolean;
    variant?: "default" | "danger";
    rightElement?: React.ReactNode;
    showArrow?: boolean;
}

export default function ProfileMenuItem({
    title,
    icon,
    iconBgColor,
    onPress,
    isLast = false,
    variant = "default",
    rightElement,
    showArrow = true,
}: ProfileMenuItemProps) {
    const { theme } = useTheme();

    const content = (
        <>
            <View style={styles.leftSection}>
                <View style={[
                    styles.iconWrapper, 
                    iconBgColor ? { backgroundColor: iconBgColor } : null
                ]}>
                    {icon}
                </View>
                {typeof title === "string" ? (
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
                ) : (
                    title
                )}
            </View>
            {rightElement ? (
                rightElement
            ) : showArrow && onPress ? (
                <IconAngleRight width={20} height={20} style={styles.arrowIcon} />
            ) : null}
        </>
    );

    if (onPress) {
        return (
            <TouchableOpacity
                style={[styles.container]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {content}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.container]}>
            {content}
        </View>
    );
}
