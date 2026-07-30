import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    docItemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 4,
    },
    docIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    docInfoWrapper: {
        flex: 1,
    },
    docTitle: {
        fontSize: 15,
        fontWeight: '700',
        fontFamily: `${FONTS.quicksand}-Bold`,
        color: '#0F172A',
    },
    docSubTitle: {
        fontSize: 13,
        fontFamily: FONTS.quicksand,
        color: '#64748B',
        marginTop: 2,
    },
    statusBadgeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    badgeTextRed: {
        color: '#EF4444',
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: `${FONTS.quicksand}-Bold`,
    },

    rejectionBox: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FEE2E2',
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
        marginBottom: 10,
    },
    rejectionText: {
        color: '#991B1B',
        fontSize: 12,
        fontStyle: 'italic',
        fontFamily: FONTS.quicksand,
        lineHeight: 18,
    },

    cardActionButton: {
        flexDirection: 'row',
        backgroundColor: '#A75D00',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    cardActionButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: `${FONTS.quicksand}-Bold`,
    },
})