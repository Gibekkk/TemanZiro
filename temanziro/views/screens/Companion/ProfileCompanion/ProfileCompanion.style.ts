import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    profileSection: {
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 5,
        paddingHorizontal: 20,
    },
    avatarWrapper: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#FFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: `${FONTS.quicksand}-Bold`,
        textAlign: "center",
        marginBottom: 8,
    },
    userDetails: {
        fontSize: 15,
        fontFamily: FONTS.quicksand,
        textAlign: "center",
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    locationText: {
        fontSize: 14,
        fontFamily: FONTS.quicksand,
    },

    menuContainer: {
        marginTop: 10,
        paddingBottom: 40,
    },

    sectionContainer: {
        paddingHorizontal: 20,
        marginVertical: 12,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(234, 234, 234, 0.6)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 2,
    },
    noDataText: {
        fontSize: 14,
        fontStyle: "italic",
        fontFamily: FONTS.quicksand,
    },
    ratingSummaryRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    overallRatingContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    overallRatingText: {
        fontSize: 48,
        fontWeight: "bold",
        fontFamily: `${FONTS.montserrat}-Bold`,
        marginBottom: 4,
    },
    starsRow: {
        flexDirection: "row",
        gap: 2,
        marginBottom: 6,
    },
    totalReviewsText: {
        fontSize: 12,
        fontFamily: FONTS.quicksand,
    },
    breakdownContainer: {
        flex: 1.5,
        gap: 6,
    },
    breakdownRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    starNumberText: {
        width: 12,
        fontSize: 12,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
        textAlign: "center",
    },
    barBackground: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 8,
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        borderRadius: 3,
    },
    reviewCountText: {
        width: 20,
        fontSize: 12,
        fontFamily: FONTS.quicksand,
        textAlign: "right",
    },
    reviewList: {
        marginTop: 16,
        gap: 12,
    },
});