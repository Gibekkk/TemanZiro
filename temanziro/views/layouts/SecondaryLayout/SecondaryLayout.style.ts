import { StyleSheet, Platform, StatusBar } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  screen: {
    flex: 1
  },
  header: {
    width: "100%",
    paddingBottom: 15,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  shadow: {
    elevation: 4,
    shadowColor: "#000",
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
    fontSize: 18,
    textAlign: "center",
    fontWeight: 'bold'
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
