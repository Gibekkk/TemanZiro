import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const PRIMARY_COLOR = "#FF8C00"; // Default bg

export default StyleSheet.create({
  logoWrapper: {
    alignItems: "center",
    flex: 1,
  },
  container: {
    width: width <= 450 ? 40 : 50,
    height: width <= 450 ? 40 : 50,
    borderRadius: 25,
    backgroundColor: `${PRIMARY_COLOR}33`, // Default warna dengan opacity 20%
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 8,
    fontSize: width <= 450 ? 10 : 12,
    fontWeight: "bold",
    color: "#666666", // Ganti dengan --text-secondary
    textAlign: "center",
  },
});