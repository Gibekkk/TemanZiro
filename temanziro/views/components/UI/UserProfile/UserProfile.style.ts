import { StyleSheet } from "react-native";

export default StyleSheet.create({
  userAvatarWrapper: {
    width: 48, // 3rem (~48px)
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarImage: {
    width: "100%",
    height: "100%",
  },
});