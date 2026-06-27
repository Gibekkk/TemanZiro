import { StyleSheet, Dimensions } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme"; 

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  ziro: {
    position: "relative",
    marginTop: height >= 720 ? 50 : 20,
    width: height >= 720 ? "90%" : "70%",
    maxWidth: 640,
    minWidth: 150,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageZiro1: {
    position: "absolute",
    left: "8%",
    top: "-7%",
    width: "40%",
    height: "40%",
    zIndex: 2,
  },
  imageZiro2: {
    width: "60%",
    height: "60%",
  },
  subTitle: {
    fontSize: width <= 450 ? 24 : 26,
    color: COMMON_COLORS.textPrimary,
    textAlign: "center",
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontWeight: 700,
    lineHeight: width <= 450 ? 30 : 40,
  },
  textHighlight: {
    color: COMMON_COLORS.secondary,
    fontFamily: `${FONTS.montserrat}-Bold`,
  },
  description: {
    fontSize: height <= 660 ? 14 : 16,
    color: COMMON_COLORS.textSecondary,
    textAlign: "center",
    marginTop: 10,
    fontFamily: FONTS.montserrat,
    letterSpacing: -0.32,
    lineHeight: 24,
  },
  button: {
    marginTop: height >= 720 ? 40 : width <= 450 ? 22 : 30,
  },

  // --- Style untuk Icon Labels ---
  logoContainers: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    marginBottom: height <= 660 ? 20 : width <= 450 ? 30 : 20,
    gap: 10,
  },
  logoWrapper: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: width <= 450 ? 40 : 50,
    height: width <= 450 ? 40 : 50,
    borderRadius: 25,
    backgroundColor: `${COMMON_COLORS.primary}33`, // Menambahkan '33' di akhir Hex = 20% Opacity
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 8,
    fontSize: width <= 450 ? 10 : 12,
    fontFamily: `${FONTS.montserrat}-Bold`,
    color: COMMON_COLORS.textSecondary,
    textAlign: "center",
  },
});