import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: FONTS.quicksand,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.quicksand,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 8,
  },
  primaryBtn: {
    marginBottom: 16,
  },
  outlineBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
  },
});