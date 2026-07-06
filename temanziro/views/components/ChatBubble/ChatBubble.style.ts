import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  container: {
    marginVertical: 4,
    width: "100%",
  },
  senderContainer: {
    alignItems: "flex-end",
  },
  receiverContainer: {
    alignItems: "flex-start",
  },
  avatarAndBubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    marginRight: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2e8f0",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: "80%",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  senderBubble: {
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONTS.quicksand,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    fontFamily: FONTS.quicksand,
    fontWeight: "400",
  },
});
