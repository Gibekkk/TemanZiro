import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1 },
  screen: { flexGrow: 1 }, // Menggunakan flexGrow agar ScrollView mengisi ruang
  headerWrapper: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // minHeight: 200,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandTitle: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  userProfileWrapper: { flexDirection: "row", gap: 12, alignItems: "center" },
});
