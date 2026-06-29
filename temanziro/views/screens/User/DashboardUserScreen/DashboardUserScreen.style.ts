import { StyleSheet } from "react-native";

export default StyleSheet.create({
  dashboard: { flex: 1 },
  headerBody: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 15,
    marginTop: 20,
  },
  mascotImage: { width: 120, height: 120 },
  textHeaderWrapper: { flex: 1, padding: 15, borderRadius: 10 },
  textHeader: { fontSize: 18, fontWeight: "bold" },
  location: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  textSubheader: { fontSize: 14, fontWeight: "700", marginLeft: 5 },
  boxHeader: { marginTop: 10, padding: 5, borderRadius: 8 },
  textHeaderLabel: { fontSize: 14, fontWeight: "700" },
  bodyWrapper: { margin: 20, paddingBottom: 60 },
  textBody: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
});
