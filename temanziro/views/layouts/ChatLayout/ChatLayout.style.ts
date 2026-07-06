import { StyleSheet } from 'react-native'
import { COMMON_COLORS, FONTS } from '@/constants/Theme'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    buttonBack: {
        padding: 8,
        marginRight: 10,
    },
    selfInfo: {
        flexDirection: 'column',
        marginLeft: 12,
        flex: 1,
    },
    selfProfileImage: {
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    placeholderProfileImage: {
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderInitial: {
        fontFamily: FONTS.quicksand,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#475569',
    },
    selfName: {
        fontFamily: FONTS.quicksand,
        fontSize: 16,
        fontWeight: '600',
        color: COMMON_COLORS.textPrimary,
        lineHeight: 20,
    },
    onlineStatus: {
        fontFamily: FONTS.quicksand,
        fontSize: 12,
        color: COMMON_COLORS.secondary,
        marginTop: 2,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: COMMON_COLORS.primaryBackground,
    },
    avatarWrapper: {
        position: 'relative',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#ffffff',
    },
})