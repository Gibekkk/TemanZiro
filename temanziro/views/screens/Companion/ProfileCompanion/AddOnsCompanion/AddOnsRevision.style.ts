import { StyleSheet } from 'react-native';
import { FONTS, COMMON_COLORS } from '@/constants/Theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerSection: {
        backgroundColor: '#fb8029',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
        alignItems: 'center',
    },
    textHeaderWrapper: {
        flex: 1,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: `${FONTS.quicksand}-Bold`,
        color: COMMON_COLORS.primary,
        marginBottom: 2,
    },
    headerBody: {
        fontFamily: FONTS.quicksand,
        fontSize: 12,
        color: COMMON_COLORS.primary,
        lineHeight: 16,
    },
    section: {
        marginTop: 20,
        marginBottom: 8,
    },
    sectionHeaderTitle: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: `${FONTS.quicksand}-Bold`,
        letterSpacing: 1.2,
        marginBottom: 8,
        marginLeft: 20,
        color: "#8C7A6B",
    },

    // Custom container card styles
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
    },

    // Document Item Row
    

    // Photo Grid Layout (Tampak Depan / Tampak Samping)
    photoGrid: {
        flexDirection: 'row',
        marginHorizontal: 16,
        gap: 12,
    },
    photoCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        height: 160,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        position: 'relative',
    },
    photoCardImg: {
        width: '100%',
        height: '100%',
    },
    photoCardFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 8,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    photoCardFooterText: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: `${FONTS.quicksand}-Bold`,
        color: '#1E293B',
    },
    photoCardFooterTextRed: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: `${FONTS.quicksand}-Bold`,
        color: '#EF4444',
    },
    photoCardFooterSubText: {
        fontSize: 10,
        fontFamily: FONTS.quicksand,
        color: '#64748B',
        marginTop: 1,
    },

    // Photo rejected state styling
    photoCardRejected: {
        flex: 1,
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        height: 160,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#FCA5A5',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    rejectedPlaceholderContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 32,
    },
    rejectedBadgeLabel: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 8,
    },
    rejectedBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
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

    // Corner verification status overlays
    cornerOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 10,
    },

    // Insurance Form Inputs
    inputGroup: {
        marginBottom: 12,
    },
    inputLabelWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: `${FONTS.quicksand}-Bold`,
        color: '#64748B',
    },
    textInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        fontFamily: FONTS.quicksand,
        color: '#1E293B',
    },
    textInputError: {
        borderColor: '#FCA5A5',
        color: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    inputWarningText: {
        fontSize: 11,
        fontStyle: 'italic',
        fontFamily: FONTS.quicksand,
        color: '#B91C1B',
        marginTop: 4,
    },

    // Divider
    cardDivider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 12,
    },

    // Bottom submit button
    submitButton: {
        backgroundColor: '#A75D00',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: 28,
        marginBottom: 36,
        shadowColor: '#A75D00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: `${FONTS.quicksand}-Bold`,
    },
});