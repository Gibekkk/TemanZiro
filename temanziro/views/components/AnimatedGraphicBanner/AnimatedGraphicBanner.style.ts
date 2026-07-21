import { StyleSheet } from "react-native";

export default StyleSheet.create({
  graphicBanner: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingVertical: 60,
    borderRadius: 13,
    borderWidth: 1,
  },
  circleBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  iconSliderWrapper: {
    width: 145,
    height: 145,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSlideContainer: {
    width: 145,
    height: 145,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperContent: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingDotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});