import { StyleSheet } from "react-native";
import { COMMON_COLORS } from "@/constants/Theme";

export default StyleSheet.create({
    verified: {
        flexDirection: 'row',
        alignItems: 'center', 
    },
    verifiedText: {
        marginLeft: 4,
        fontSize: 14,
        color: COMMON_COLORS.primary,
        fontWeight: 'bold',
  }
})