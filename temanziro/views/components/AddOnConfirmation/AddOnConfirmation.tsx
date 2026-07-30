import styles from "./AddOnConfirmation.style";
import { ADD_ON_STATUS, AddOnStatus, } from "@/constants/AddOnConstant";
import { useTheme } from "@/controllers/hooks/useTheme";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";

interface AddOnConfirmationProps {
    status: AddOnStatus;
    onComplete: () => void;
}

export default function AddOnConfirmationCard({ status, onComplete }: AddOnConfirmationProps) {
    const { theme } = useTheme();

    let statusText = "";
    let badgeBgColor = "";
    let badgeTextColor = "";
    let showArrow = false;

    if (status === ADD_ON_STATUS.REVISION) {
        statusText = "Butuh Revisi";
        badgeBgColor = "rgba(34, 64, 196, 0.1)";
        badgeTextColor = theme.colors.primary; 
        showArrow = true;
    } else if (status === ADD_ON_STATUS.PENDING) {
        statusText = "Sedang Diproses";
        badgeBgColor = "rgba(233, 97, 0, 0.1)"; 
        badgeTextColor = theme.colors.secondary;
        showArrow = false;
    } else {
        statusText = "Di Tolak";
        badgeBgColor = "rgba(225, 29, 72, 0.1)";
        badgeTextColor = theme.colors.red;
        showArrow = true;
    }

    const isClickable = status === ADD_ON_STATUS.REVISION || status === ADD_ON_STATUS.REJECTED;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={isClickable ? onComplete : undefined}
            activeOpacity={isClickable ? 0.7 : 1}
            disabled={!isClickable}
        >
            <View style={styles.leftSection}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="alert-outline" size={18} color={theme.colors.red} />
                </View>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                    Konfirmasi Add-On
                </Text>
            </View>
            
            <View style={styles.rightSection}>
                <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
                    <Text style={[styles.badgeText, { color: badgeTextColor }]}>
                        {statusText}
                    </Text>
                </View>
                {showArrow && (
                    <IconAngleRight width={20} height={20} style={styles.arrowIcon} />
                )}
            </View>
        </TouchableOpacity>
    )
}