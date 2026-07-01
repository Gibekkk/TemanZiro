import { StyleSheet } from "react-native";
import { COMMON_COLORS } from "@/constants/Theme";

export default StyleSheet.create({
  wrapper: {
    position: "relative",
    alignSelf: "center",
  },
  avatarContainer: {
    overflow: "hidden",
    backgroundColor: "#fdeede",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COMMON_COLORS.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  cameraButton: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
});
