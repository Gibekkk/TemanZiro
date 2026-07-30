import { StyleSheet, Dimensions } from "react-native";
import { FONTS } from "@/constants/Theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  logoWrapper: {
    alignItems: "center",
    flex: 1,
  },
  container: {
    width: width <= 450 ? 50 : 60,
    height: width <= 450 ? 50 : 60,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center", 
    marginTop: 8,
  },
  label: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  desc: {
    fontFamily: `${FONTS.quicksand}-Medium`,
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
});
