import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  container: {
    width: "100%",
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: `${FONTS.quicksand}-Bold`,
    color: COMMON_COLORS.textPrimary,
  },
  stepInfo: {
    fontSize: 14,
    fontFamily: FONTS.quicksand,
    color: COMMON_COLORS.textSecondary,
  },
  barBackground: {
    height: 8,
    backgroundColor: COMMON_COLORS.border, 
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: COMMON_COLORS.secondary,
    borderRadius: 10,
  },
});