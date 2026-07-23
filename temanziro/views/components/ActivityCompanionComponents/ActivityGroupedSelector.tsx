import React from "react";
import { View, Text, Switch, Image } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import { ACTIVITY_TYPE } from "@/constants/BookingDetails";
import styles from "./ActivityGroupedSelector.style";

interface ActivityItem {
    label: string;
    value: string;
    image: any;
}

interface ActivityGroupedSelectorProps {
    selectedActivities: string[];
    onActivityToggle: (value: string) => void;
}

const ACTIVITY_MAPPING: Record<string, { label: string }> = {
    belajar: { label: "Belajar" },
    hiburan: { label: "Hiburan" },
    kuliner: { label: "Kuliner" },
    olahraga: { label: "Olahraga" },
    nongkrong: { label: "Nongkrong" },
    "jalan-jalan": { label: "Traveling" },
    jalan: { label: "Traveling" },
};

export default function ActivityGroupedSelector({
    selectedActivities,
    onActivityToggle,
}: ActivityGroupedSelectorProps) {
    const { theme } = useTheme();

    // Map the ACTIVITY_TYPE array flatly to our items using mapped labels and images from constant
    const items: ActivityItem[] = [];
    ACTIVITY_TYPE.forEach((act) => {
        const mapping = ACTIVITY_MAPPING[act.value];
        if (mapping) {
            items.push({
                label: mapping.label,
                value: act.value,
                image: act.image,
            });
        }
    });

    return (
        <View style={styles.groupContainer}>
            {/* Section Title */}
            <Text style={[styles.groupTitle, { color: theme.colors.textSecondary || "#6B7280" }]}>
                AKTIVITAS
            </Text>

            {/* Flat Card containing all items */}
            <View style={styles.card}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isToggled = selectedActivities.includes(item.value);

                    return (
                        <View key={item.value}>
                            <View style={styles.row}>
                                {/* Left: Image and Label */}
                                <View style={styles.leftSection}>
                                    <Image source={item.image} style={styles.imageIcon} />
                                    <Text style={[styles.rowLabel, { color: theme.colors.textPrimary }]}>
                                        {item.label}
                                    </Text>
                                </View>

                                {/* Right: Switch */}
                                <Switch
                                    value={isToggled}
                                    onValueChange={() => onActivityToggle(item.value)}
                                    trackColor={{ false: "#E5E7EB", true: "#FBD5C0" }}
                                    thumbColor={isToggled ? (theme.colors.secondary || "#e96100") : "#F4F3F0"}
                                />
                            </View>

                            {/* Divider */}
                            {!isLast && <View style={styles.divider} />}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
