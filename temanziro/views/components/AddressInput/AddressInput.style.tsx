import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    inputContainerRow: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        zIndex: 10,
    },
    inputIcon: {
        marginRight: 12,
    },
    bottomBorderInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#cbd5e1",
        fontSize: 16,
        fontWeight: "700",
        color: "#0f172a",
        paddingVertical: 6,
        paddingHorizontal: 0,
        fontFamily: `${FONTS.quicksand}-Bold`,
    },
    dropdownContainer: {
        position: "absolute",
        top: 38,
        left: 30,
        right: 0,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 8,
        maxHeight: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        zIndex: 999,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    dropdownItemText: {
        fontSize: 14,
        color: "#334155",
        fontFamily: `${FONTS.quicksand}-Regular`,
    },
});
