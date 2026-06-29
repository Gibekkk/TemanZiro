import { StyleSheet } from "react-native";

export default StyleSheet.create({
  grid: { gap: 16 },
  card: { height: 160, borderRadius: 16, elevation: 5 },
  image: { width: "100%", height: "100%", justifyContent: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, borderRadius: 16 },
  textContainer: { paddingHorizontal: 24 },
  title: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  vibes: { fontSize: 14, color: "#e0e0e0", marginTop: 4 },
});
