import { StyleSheet } from "react-native";

const THIRD_COLOR = "#FF6B00"; // Ganti dengan --third-color

export default StyleSheet.create({
  baseButton: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  baseText: {
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1.5,
  },
  primaryButton: {
    backgroundColor: THIRD_COLOR,
  },
  primaryText: {
    color: "#FFFFFF",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: THIRD_COLOR,
    
  },
  outlineText: {
    color: THIRD_COLOR,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: THIRD_COLOR,
  },
  hasShadow: {
    elevation: 6,
    shadowColor: THIRD_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});