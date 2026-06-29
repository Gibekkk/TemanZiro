import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  incomeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignSelf: "flex-start",
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 14,
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontWeight: "700",
    marginBottom: 2,
  },
  amountText: {
    fontSize: 16,
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontWeight: "700",
  },
});