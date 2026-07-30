import { StyleSheet, Dimensions } from "react-native";
import { FONTS } from "@/constants/Theme";

// Mengambil ukuran layar dinamis
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  // --- HERO SECTION ---
  heroSection: {
    width: "100%",
    height: height * 0.42, 
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
    overflow: "hidden", 
    marginTop: height * 0.02,
  },
  cityBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: height * 0.09,
    zIndex: 0,
    opacity: 0.8,
  },
  mascotWrapper: {
    width: width * 0.75,
    height: width * 0.75,
    zIndex: 2,
    marginBottom: height * 0.05,
  },
  ziroTalk: {
    position: "absolute",
    top: height * 0,
    bottom: height * 0, 
    left: width * 0.12,
    width: width * 0.27, 
    height: width * 0.27,
    zIndex: 3, 
  },
  curveMound: {
    position: "absolute",
    bottom: -(width * 2.05), 
    width: width * 2.3,
    height: width * 2.3, 
    borderRadius: width,
    zIndex: 1,
  },

  // --- CONTENT SECTION ---
  contentContainer: {
    position: "relative",
    paddingHorizontal: 24,
    marginTop: -(height * 0.05),
    alignItems: "center",
    zIndex: 3,
  },
  subTitle: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "bold",
  },
  textHighlight1: {
    fontWeight: "bold",
    fontSize: 24,
  },
  textHighlight: {
    fontWeight: "bold",
  },
  description: {
    fontFamily: `${FONTS.quicksand}-Medium`,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: height * 0.03, // Dinamis
  },
  button: {
    width: "100%",
    marginBottom: height * 0.04, // Dinamis
  },

  // --- FEATURE ICONS SECTION ---
  logoContainers: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: height * 0.05, // Dinamis
    zIndex: 3,
  },
});