import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  scheduleCard: {
    borderWidth: 1,
    // borderColor: "#e2e8f0",
    borderRadius: 16,
    // backgroundColor: "#ffffff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  avatarSmall: {
    marginRight: 12,
    position: "relative",
  },
  avatarSmallImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    // borderColor: "#f0dfd7",
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
    // borderColor: "#ffffff",
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 14,
    fontWeight: "800",
    // color: "#d95d16",
    marginBottom: 4,
    marginRight: 85,
  },
  infoRow: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 2,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    // color: "#475569",
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    fontFamily: `${FONTS.montserrat}-Bold`,
    color: "#ffffff",
  },
});