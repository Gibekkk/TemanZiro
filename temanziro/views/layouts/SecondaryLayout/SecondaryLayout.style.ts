import { StyleSheet, Platform, StatusBar } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: `${COMMON_COLORS.primaryBackground}`,
  },
  header: {
    width: "100%",
    backgroundColor: `${COMMON_COLORS.primaryBackground}`,
    // Padding top untuk menghindari area notch/kamera di HP
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 60,
    paddingBottom: 15,
    zIndex: 10,
  },
  shadow: {
    elevation: 4, // Shadow untuk Android
    shadowColor: "#000", // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  noShadow: {
    elevation: 0,
    shadowOpacity: 0,
  },
  secondHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  secondHeaderLeft: {
    justifyContent: "flex-start",
  },
  backButton: {
    padding: 10,
    marginRight: 10,
    zIndex: 2,
  },
  contentHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  contentHeaderLeft: {
    justifyContent: "flex-start",
    paddingLeft: 10,
  },
  title: {
    fontFamily: `${FONTS.quicksand}-Bold`,
    color: COMMON_COLORS.textPrimary,
    fontSize: 18,
    textAlign: "center",
  },
  titleLeft: {
    textAlign: "left",
  },
  profileIcon: {
    position: "absolute",
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  tabsWrapper: {
    width: "100%",
    paddingHorizontal: "10%",
    marginTop: 10,
  },
  contentScreen: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: "6%",
    paddingTop: "5%",
    paddingBottom: 10,
  },
});
