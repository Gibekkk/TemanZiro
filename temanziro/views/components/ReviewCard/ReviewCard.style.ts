import { StyleSheet } from 'react-native';
import { FONTS } from '@/constants/Theme';

export default StyleSheet.create({
    reviewCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(234, 234, 234, 0.6)",
    },
    reviewHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    reviewerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        backgroundColor: "#e2e8f0",
    },
    reviewerInfo: {
        flexDirection: "column",
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: `${FONTS.quicksand}-Bold`,
        marginBottom: 2,
    },
    reviewStarsRow: {
        flexDirection: "row",
        gap: 1.5,
    },
    reviewText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: FONTS.quicksand,
    },
});
