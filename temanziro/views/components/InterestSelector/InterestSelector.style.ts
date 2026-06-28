import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 20,
    flexDirection: "column",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 6,
  },
  button: {
    width: "48%", // Grid layout 2 kolom
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});