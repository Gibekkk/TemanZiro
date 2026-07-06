import { StyleSheet } from 'react-native';
import { COMMON_COLORS, FONTS } from '@/constants/Theme';

export default StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 24,
    },
    messageContainer: {
        marginBottom: 16,
        maxWidth: '80%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    myBubble: {
        backgroundColor: COMMON_COLORS.secondary,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    messageText: {
        fontFamily: FONTS.quicksand,
        fontSize: 14,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#FFFFFF',
    },
    otherMessageText: {
        color: COMMON_COLORS.textPrimary,
    },
    timeText: {
        fontFamily: FONTS.quicksand,
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 4,
    },
    myTimeText: {
        marginRight: 4,
    },
    otherTimeText: {
        marginLeft: 4,
    },
    chatStatus: {
        width: '50%',
        borderRadius: 10,
    }
})