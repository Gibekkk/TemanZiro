import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F6F8",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: "center",
        marginVertical: 12,
        gap: 8,
    },
    text: {
        fontFamily: FONTS.quicksand,
        fontSize: 14,
        fontWeight: "500",
        color: "#475569",
    },
});
