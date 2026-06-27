import { StyleSheet, Dimensions } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  logoWrapper: {
    alignItems: "center",
    flex: 1,
  },
  container: {
    width: width <= 450 ? 40 : 50,
    height: width <= 450 ? 40 : 50,
    borderRadius: 25,
    backgroundColor: `${COMMON_COLORS.secondaryBackground}`,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 8,
    fontSize: width <= 450 ? 10 : 12,
    fontWeight: "bold",
    color: "#666666", // Ganti dengan --text-secondary
    textAlign: "center",
  },
});