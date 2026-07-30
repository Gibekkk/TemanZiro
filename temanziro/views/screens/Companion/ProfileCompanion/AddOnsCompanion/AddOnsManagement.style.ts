import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 8,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeaderTitle: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: FONTS.quicksand,
        letterSpacing: 1.2,
        marginBottom: 8,
        marginLeft: 12,
        color: "#8C7A6B",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(240, 240, 240, 0.8)",
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
        color: "#2C1B10",
    },
    linkRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    linkText: {
        fontSize: 12,
        fontFamily: FONTS.quicksand,
        color: "#9C430B",
        maxWidth: "85%",
    },
    editIcon: {
        marginLeft: 6,
    },
    divider: {
        height: 1,
        backgroundColor: "#F1ECE5",
        marginHorizontal: 16,
    },
    titleWithBadgeRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    vehicleModelText: {
        fontSize: 15,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
        color: "#2C1B10",
        marginRight: 8,
        maxWidth: "60%",
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    verifiedBadge: {
        backgroundColor: "#E6F7F0",
    },
    unverifiedBadge: {
        backgroundColor: "#F1F3F5",
    },
    statusBadgeText: {
        fontSize: 9,
        fontWeight: "bold",
        fontFamily: FONTS.quicksand,
    },
    verifiedBadgeText: {
        color: "#059669",
    },
    unverifiedBadgeText: {
        color: "#64748b",
    },
    licensePlateText: {
        fontSize: 12,
        color: "#8C7A6B",
        fontFamily: FONTS.quicksand,
        marginTop: 1,
    },
    addVehicleText: {
        fontSize: 15,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
        color: "#9C430B",
    },
    infoContainer: {
        marginTop: 24,
        alignItems: "center",
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    infoText: {
        fontSize: 12,
        fontFamily: FONTS.quicksand,
        color: "#8C7A6B",
        textAlign: "center",
        lineHeight: 18,
        marginBottom: 12,
    },
    linkButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    linkTextButton: {
        fontSize: 14,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
        color: "#9C430B",
    },
});