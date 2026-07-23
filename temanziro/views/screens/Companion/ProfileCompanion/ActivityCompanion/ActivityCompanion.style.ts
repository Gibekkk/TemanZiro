import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
    },
    genderPreferenceSection: {
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
    genderCard: {
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
    genderCardTitle: {
        fontSize: 13,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
        marginBottom: 2,
    },
    genderCardSubtitle: {
        fontSize: 11,
        color: "#9CA3AF",
        fontFamily: FONTS.quicksand,
        marginBottom: 14,
    },
    selectorWrapper: {
        marginTop: 4,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    saveButton: {
        borderRadius: 12,
        height: 48,
    },
});
