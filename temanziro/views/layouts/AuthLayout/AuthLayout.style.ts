import { StyleSheet, Dimensions } from "react-native";
// Pastikan path import ini sesuai dengan lokasi file Theme.ts kamu
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  screen: {
    flex: 1,
    // paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  title: {
    fontFamily: `${FONTS.quicksand}-Bold`,
    fontWeight: "bold",
    fontSize: 26,
  },
  titleHighlight: {
    color: COMMON_COLORS.secondary,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  tagText: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontWeight: "bold",
    color: COMMON_COLORS.primary,
    fontSize: 12,
  },
  container: {
    flex: 1,
    paddingVertical: "5%",
  },
});
