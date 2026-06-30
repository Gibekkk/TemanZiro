import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerBody: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
    // marginTop: 20,
  },
  // mascotImage: { height: 140 },
  textHeaderWrapper: { flex: 1, padding: 15, borderRadius: 10 },
  textHeader: { fontSize: 18, fontWeight: "bold" },
  location: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  textSubheader: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
    maxWidth: 185,
  },
  boxHeader: { marginTop: 10, padding: 5, borderRadius: 8 },
  textHeaderLabel: { fontSize: 14, fontWeight: "700" },
  bodyWrapper: { margin: 20 },
  textBody: { fontSize: 20, fontWeight: "bold", marginBottom: 3 },
  textBody1: { fontSize: 13, fontWeight: "500", marginBottom: 15 },
  cardContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 5,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 8,
    gap: 6,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
  rightColumn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 30
  },
});
