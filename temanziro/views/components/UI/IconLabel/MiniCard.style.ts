import { StyleSheet } from 'react-native';
import { FONTS } from '@/constants/Theme';

export default StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "rgba(234, 234, 234, 0.6)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 2,
    },
    text: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
        marginLeft: 16,
    },
});
