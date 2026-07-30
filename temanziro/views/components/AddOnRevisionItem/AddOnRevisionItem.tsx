import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import styles from "./AddOnRevisionItem.style";

interface RevisionItemProps {
    title: string;
    value: string;
    status: string;
    rejectionMessage?: string;
    icon: React.ReactNode;
    onUploadPress?: () => void;
}

export const RevisionItem: React.FC<RevisionItemProps> = ({
    title,
    value,
    status,
    rejectionMessage,
    icon,
    onUploadPress
}) => {
    const isRejected = status === "revision" || status === "rejected";
    const isPending = status === "pending";

    return (
        <View style={{ flexDirection: "column" }}>
            <View style={styles.docItemRow}>
                <View style={styles.docIconContainer}>
                    {icon}
                </View>
                <View style={styles.docInfoWrapper}>
                    <Text style={styles.docTitle}>{title}</Text>
                    <Text style={styles.docSubTitle}>{value}</Text>
                </View>
                <View style={styles.statusBadgeWrapper}>
                    {isRejected ? (
                        <>
                            <Feather name="x-circle" size={20} color="#EF4444" />
                        </>
                    ) : isPending ? (
                        <Feather name="clock" size={20} color="#F59E0B" />
                    ) : (
                        <Feather name="help-circle" size={20} color="#94A3B8" />
                    )}
                </View>
            </View>

            {/* Rejection Message Box */}
            {isRejected && rejectionMessage ? (
                <View style={styles.rejectionBox}>
                    <Text style={styles.rejectionText}>
                        "{rejectionMessage}"
                    </Text>
                </View>
            ) : null}

            {/* Action button to upload again */}
            {isRejected && onUploadPress && (
                <TouchableOpacity 
                    style={styles.cardActionButton} 
                    onPress={onUploadPress}
                    activeOpacity={0.8}
                >
                    <Feather name="upload-cloud" size={16} color="#FFFFFF" />
                    <Text style={styles.cardActionButtonText}>Ganti Dokumen</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};