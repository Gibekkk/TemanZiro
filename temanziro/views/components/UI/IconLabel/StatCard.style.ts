import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 18,
  },
  iconContainer: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  titleText: {
    fontSize: 11,
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontWeight: "700",
    marginBottom: 2,
  },
  valueText: {
    fontSize: 13,
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontWeight: "700",
  },
});
