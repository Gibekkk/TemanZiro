import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    groupContainer: {
        marginBottom: 24,
    },
    groupTitle: {
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: FONTS.quicksand,
        letterSpacing: 1.2,
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: "rgba(240, 240, 240, 0.8)",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    imageIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        marginRight: 12,
    },
    rowLabel: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(243, 244, 246, 0.8)",
    },
});
