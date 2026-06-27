import { StyleSheet, Dimensions } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  // Custom
  CustomIconLabel: {
    flex: 0,
    position: "absolute",
    top: -30,
  },
  CustomIcon: {
    width: 200,
    height: 200,
  },
  customcontainericon: {
    padding: 30,
    backgroundColor: `${COMMON_COLORS.secondaryBackground}`,
    borderRadius: 100,
  },
  custombtntext: {
    fontSize: 14,
  },

  // Style
  containerImg: {
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    paddingVertical: "8%",
    paddingHorizontal: "10%",
    borderRadius: 20,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 16,
    color: COMMON_COLORS.textPrimary,
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    maxWidth: 400,
    fontSize: 12,
    fontFamily: FONTS.montserrat,
    color: COMMON_COLORS.textSecondary,
    lineHeight: 20,
  },
  button: {
    width: "100%",
  },
  footerContainer: {
    fontSize: 12,
    fontFamily: `${FONTS.montserrat}-Bold`,
    color: `${COMMON_COLORS.textSecondary}80`, // 80 adalah hex untuk 50% opacity
    marginTop: 20,
    textAlign: "center",
  },
  ktpimgcontainer: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: `${COMMON_COLORS.secondaryBackground}90`,
    borderRadius: 15,
  },
  ktpimg: { width: 100, height: 100, borderRadius: 50 },
});
