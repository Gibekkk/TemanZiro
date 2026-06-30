import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontFamily: `${FONTS.quicksand}-Bold`,
    fontSize: 12,
    fontWeight: "700",
    color: COMMON_COLORS.textPrimary,
  },
  activeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  activeText: {
    fontFamily: `${FONTS.quicksand}-Bold`,
    fontSize: 12,
    fontWeight: "700",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
