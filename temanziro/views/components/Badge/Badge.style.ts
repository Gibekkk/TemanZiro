import { StyleSheet } from "react-native";

export default StyleSheet.create({
  tierCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  tierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tierInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  imgMedali: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  tierName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  rewardsLink: {
    fontSize: 12,
    fontWeight: "700",
    color: "#d95d16",
    textDecorationLine: "underline",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginRight: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },
});