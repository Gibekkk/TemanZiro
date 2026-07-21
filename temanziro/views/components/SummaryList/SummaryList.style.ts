import { StyleSheet } from "react-native";

export default StyleSheet.create({
  centerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#64748B",
  },
  summaryList: {
    flexDirection: "column",
    gap: 24,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
    flexDirection: "column",
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 6,
  },
  itemValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "400",
  },
});