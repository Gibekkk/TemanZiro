import { StyleSheet } from "react-native";
import { FONTS, COMMON_COLORS } from '@/constants/Theme';

export default StyleSheet.create({
    headerSection: {
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: COMMON_COLORS.red,
    },
    subHeaderText: {
        fontSize: 14,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeaderTitle: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: FONTS.quicksand,
        letterSpacing: 1.2,
        marginLeft: 10,
        color: "#8C7A6B",
        paddingHorizontal: 10,
    },
})