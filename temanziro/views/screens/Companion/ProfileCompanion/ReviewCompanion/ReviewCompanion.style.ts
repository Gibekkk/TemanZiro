import { StyleSheet } from "react-native"
import { FONTS } from "@/constants/Theme"

export default StyleSheet.create({
    sectionContainer: {
        marginVertical: 12,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: `${FONTS.quicksand}-Bold`,
        marginBottom: 10,
    },
    sectionTitleHeader: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: `${FONTS.quicksand}-Bold`,
        marginBottom: 12,
        textAlign: "left",
    },
    sectionSubtitle: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: `${FONTS.quicksand}-Bold`,
        marginBottom: 14,
    },
    philosophyText: {
        fontSize: 14,
        lineHeight: 22,
        fontStyle: "italic",
        fontFamily: FONTS.quicksand,
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
        marginLeft: 10,
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        borderRadius: 3,
    },
    filterScrollView: {
        marginBottom: 16,
    },
    filterContainer: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    filterText: {
        fontSize: 14,
        fontFamily: FONTS.quicksand,
    },
    reviewList: {
        gap: 12,
    },
})
