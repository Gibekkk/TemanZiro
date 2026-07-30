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
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
    },
    arrowIcon: {
        marginLeft: 8,
        opacity: 0.7,
    },
});
