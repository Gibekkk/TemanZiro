import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import styles from "./VerifyBadge.style";
import React from "react";
import { View, Text } from "react-native";
import IconVerified from "@/assets/icon/verified1.svg";

export interface VerifyBadgeProps {
    text?: string;
    enabled?: boolean;
}

export default function VerifyBadge({ text = "Terverifikasi", enabled = false }: VerifyBadgeProps) {
    const { isVerified } = useUserProfile();
    const { shouldDisplay } = isVerified ? { shouldDisplay: true } : { shouldDisplay: false };

    if (!shouldDisplay) {
        return null;
    }

    return (
        <View style={styles.verified}>
            <IconVerified width={20} height={20}/>
            <Text style={styles.verifiedText}>{text}</Text>
        </View>
    );
}