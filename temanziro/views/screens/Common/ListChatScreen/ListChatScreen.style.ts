import { StyleSheet } from 'react-native';
import { COMMON_COLORS, FONTS } from '@/constants/Theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    searchBarWrapper: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    activeTabButton: {
        backgroundColor: COMMON_COLORS.secondary,
        borderColor: COMMON_COLORS.secondary,
    },
    tabText: {
        fontFamily: FONTS.quicksand,
        fontSize: 14,
        fontWeight: '600',
        color: COMMON_COLORS.textSecondary,
    },
    activeTabText: {
        color: '#ffffff',
        fontWeight: '700',
    },
    chatList: {
        flex: 1,
    },
    chatListContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    imgInfo: {
        marginBottom: 16,
    },
    infoText: {
        fontFamily: FONTS.quicksand,
        fontSize: 16,
        fontWeight: '700',
        color: COMMON_COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 80,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontFamily: FONTS.quicksand,
        fontSize: 14,
        color: COMMON_COLORS.textSecondary,
        marginTop: 8,
    },
    chatItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e2e8f0',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    chatInfoTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    nameText: {
        fontFamily: FONTS.quicksand,
        fontSize: 16,
        fontWeight: '700',
    },
    timeText: {
        fontFamily: FONTS.quicksand,
        fontSize: 12,
    },
    previewText: {
        fontFamily: FONTS.quicksand,
        fontSize: 14,
    },


    tabBar: { 
        flexDirection: 'row', 
        // borderBottomWidth: 1 
    },
    tabItem: { 
        flex: 1, 
        paddingVertical: 12, 
        alignItems: 'center' 
    },
});