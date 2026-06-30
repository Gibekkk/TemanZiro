import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";
import { SvgProps } from "react-native-svg";
import styles from "./MiniCard.style";

interface MiniCardProps {
    title: string;
    icon: React.ComponentType<SvgProps>;
    onPress: () => void;
}

export default function MiniCard({ title, icon: IconComponent, onPress }: MiniCardProps) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: theme.colors.tertiaryBackground }]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <IconComponent width={20} height={20} />
            <Text style={[styles.text, { color: theme.colors.textPrimary }]}>
                {title}
            </Text>
            <IconAngleRight width={20} height={20} />
        </TouchableOpacity>
    );
}
