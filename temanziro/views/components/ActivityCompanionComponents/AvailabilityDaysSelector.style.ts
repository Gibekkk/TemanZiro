import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    sectionHeaderTitle: {
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: FONTS.quicksand,
        letterSpacing: 1.2,
        marginBottom: 8,
        marginLeft: 4,
        color: "#6B7280",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: "rgba(240, 240, 240, 0.8)",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
    },
    resetButtonText: {
        fontSize: 14,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
    },
    presetsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },
    presetChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    presetChipText: {
        fontSize: 13,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
    },
    daysGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dayCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    dayCircleText: {
        fontSize: 13,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
    },
});
