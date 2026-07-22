import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
    },
    arrowIcon: {
        opacity: 0.3,
    },
});
