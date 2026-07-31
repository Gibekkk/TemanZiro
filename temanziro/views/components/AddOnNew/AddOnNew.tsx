import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import styles from "./AddOnNew.style";

interface AddOnNewProps {
    onAddDocumentation?: () => void;
    onAddTransportation?: () => void;
}

export default function AddOnNew({
    onAddDocumentation,
    onAddTransportation,
}: AddOnNewProps) {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                Tambahkan Add On
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Anda belum memiliki add-on aktif.{"\n"}Tambahkan portofolio atau data kendaraan untuk mengaktifkan add-on Anda.
            </Text>

            <View style={styles.buttonContainer}>
                <GeneralButton
                    variant="primary"
                    onClick={onAddDocumentation}
                    style={styles.primaryBtn}
                >
                    + Dokumentasi
                </GeneralButton>

                <GeneralButton
                    variant="outline"
                    onClick={onAddTransportation}
                    style={[styles.outlineBtn, { borderColor: theme.colors.border }]}
                    textStyle={{ color: theme.colors.secondary }}
                >
                    + Transportasi
                </GeneralButton>
            </View>
        </View>
    );
}