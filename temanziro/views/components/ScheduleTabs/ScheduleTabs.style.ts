import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    bottomSheet: {
        flex: 1,
        paddingHorizontal: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        marginTop: 10,
    },
    tabBar: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tabBarScroll: {
        flexDirection: 'row',
    },
    tabItem: {
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontFamily: FONTS.quicksand,
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: `${FONTS.montserrat}-Bold`,
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 12,
    },
    viewAll: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    viewAllText: {
        fontFamily: `${FONTS.quicksand}-Bold`,
        fontWeight: "700",
        fontSize: 12,
    },
    scheduleListContainer: {
        flex: 1,
        width: "100%",
    },
    emptyState: {
        fontFamily: `${FONTS.quicksand}-Medium`,
        fontSize: 13,
        textAlign: "center",
        paddingVertical: 24,
    },
});
