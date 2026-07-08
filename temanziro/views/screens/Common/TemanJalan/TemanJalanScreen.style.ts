import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 0,
    alignItems: "center",
  },
  title: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: `${FONTS.quicksand}-Medium`,
    fontSize: 14,
  },
  carouselContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardsWrapper: {
    paddingHorizontal: 12,
  },
  paginationWindow: {
    height: 20,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  paginationTrack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 8,
  },
  dotActive: {
    width: 20,
  },
  centerContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: `${FONTS.quicksand}-Medium`,
    fontSize: 14,
    textAlign: "center",
  },
});