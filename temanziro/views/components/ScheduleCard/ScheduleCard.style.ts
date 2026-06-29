import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scheduleCard: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
  },
  avatarSmall: {
    marginRight: 12,
  },
  avatarSmallImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f0dfd7",
  },
  scheduleInfo: {
    flex: 1,
    paddingRight: 80, // Memberikan ruang agar teks tidak menumpuk dengan badge status
  },
  scheduleName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#d95d16",
    marginBottom: 4,
  },
  infoRow: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 2,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 11,
    color: "#475569",
  },
});