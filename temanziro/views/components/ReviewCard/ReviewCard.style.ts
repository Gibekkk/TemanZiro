import { StyleSheet } from 'react-native';
import { FONTS } from '@/constants/Theme';

export default StyleSheet.create({
    reviewCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 2,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: "#e2e8f0",
    },
    initialsAvatar: {
        backgroundColor: "#adcbfb",
        justifyContent: "center",
        alignItems: "center",
    },
    initialsText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1e3a8a",
        fontFamily: `${FONTS.quicksand}-Bold`,
    },
    reviewerInfo: {
        flexDirection: "column",
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: `${FONTS.quicksand}-Bold`,
        marginBottom: 2,
    },
    reviewStarsRow: {
        flexDirection: "row",
        gap: 2,
    },
    reviewDate: {
        fontSize: 12,
        fontFamily: FONTS.quicksand,
    },
    reviewText: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: FONTS.quicksand,
    },
    photosRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 14,
    },
    reviewPhoto: {
        width: 72,
        height: 72,
        borderRadius: 8,
        backgroundColor: "#e2e8f0",
    },
});

