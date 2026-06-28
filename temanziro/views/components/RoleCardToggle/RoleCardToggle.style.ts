import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  roleContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginTop: 16,
    overflow: "hidden",
  },
  activeCard: {
    borderColor: COMMON_COLORS.secondary,
    elevation: 10,
    shadowColor: `${COMMON_COLORS.secondary}`,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  imgContainer: {
    width: "100%",
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center",
    height: 140,
  },
  content: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  contentTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleText: {
    color: COMMON_COLORS.textPrimary,
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 16,
  },
  contentText: {
    color: COMMON_COLORS.textSecondary,
    fontFamily: FONTS.quicksand,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 20,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  roleNameText: {
    color: `${COMMON_COLORS.textSecondary}99`,
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 12,
  },
  nextButton: {
    backgroundColor: "#D1D1D1",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: COMMON_COLORS.secondary,
  },
  nextButtonText: {
    color: "#000",
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 15,
    letterSpacing: 1,
  },
  activeButtonText: {
    color: "#fff",
  },
});
