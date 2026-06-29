import { StyleSheet } from "react-native";
import { COMMON_COLORS } from "@/constants/Theme";

export default StyleSheet.create({
  scrollContainer: {
    paddingRight: 16,
  },
  loadingContainer: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 12,
    color: COMMON_COLORS.textSecondary,
    marginLeft: 8,
  },
  friendItem: {
    alignItems: "center",
    marginRight: 16,
    width: 64,
  },
  avatarWrapper: {
    position: "relative",
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COMMON_COLORS.secondary,
  },
  onlineIndicator: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 12,
    height: 12,
    backgroundColor: COMMON_COLORS.online,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  friendName: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "600",
    color: COMMON_COLORS.textPrimary,
    textAlign: "center",
  },
});