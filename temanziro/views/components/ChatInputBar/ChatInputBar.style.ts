import { StyleSheet } from 'react-native'
import { COMMON_COLORS, FONTS } from '@/constants/Theme'

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    buttonAdd: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonSend: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COMMON_COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonSendDisabled: {
        backgroundColor: '#E2E8F0',
    },
    inputField: {
        flex: 1,
        height: 40,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        fontFamily: FONTS.quicksand,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    }
})