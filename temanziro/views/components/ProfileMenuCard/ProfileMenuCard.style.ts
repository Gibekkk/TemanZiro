import { StyleSheet } from "react-native";

export default StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(240, 240, 240, 0.8)",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(243, 244, 246, 0.8)",
        marginHorizontal: 16,
    },
});
