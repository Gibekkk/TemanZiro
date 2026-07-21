import { StyleSheet } from "react-native";

export default StyleSheet.create({
  minatComponent: {
    width: "100%",
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  capsule: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 30,
  },
  capsuleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  capsuleAdd: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  inputContainer: {
    flexDirection: "column",
  },
  customInput: {
    width: 140,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderRadius: 30,
    fontSize: 14,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
});