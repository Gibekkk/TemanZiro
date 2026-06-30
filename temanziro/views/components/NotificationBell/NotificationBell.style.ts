import { StyleSheet } from "react-native";
import { COMMON_COLORS } from "@/constants/Theme";

export default StyleSheet.create({
  notifWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
  },
  notifBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: COMMON_COLORS.red,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COMMON_COLORS.primaryBackground,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 11,
  },
});
