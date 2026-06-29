import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  section: {
    marginBottom: 20,
    width: "100%",
  },
  sectionTitle: {
    fontFamily: `${FONTS.quicksand}-Bold`,
    fontSize: 16,
    color: COMMON_COLORS.textPrimary,
    marginBottom: 10,
    fontWeight: "bold",
  },
  cardWrapper: {
    marginBottom: 15,
  },
});
