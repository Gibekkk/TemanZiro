import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  title: {
    color: COMMON_COLORS.textPrimary,
    fontFamily: `${FONTS.quicksand}-Bold`,
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: COMMON_COLORS.textSecondary,
    fontFamily: FONTS.quicksand,
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20, // Disesuaikan untuk keterbacaan di layar mobile
    marginBottom: 10,
  },
  actionContainer: {
    marginTop: 40,
    paddingBottom: 40,
  },
  fullWidthBtn: {
    width: "100%",
    marginBottom: 20,
  },
  footerDesc: {
    width: "100%",
    color: COMMON_COLORS.textSecondary,
    fontFamily: FONTS.quicksand,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  btntext: {
    color: COMMON_COLORS.lightText
  }
});