import { StyleSheet } from "react-native";

export default StyleSheet.create({
  containerLocation: {
    borderWidth: 1,
    borderRadius: 25,
    padding: 20,
    marginBottom: 30,
    position: "relative",
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  searchBar: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    padding: 0, 
  },
  dropdown: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
    borderWidth: 1,
    borderRadius: 16,
    maxHeight: 200,
    zIndex: 999,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dropdownList: {
    paddingVertical: 6,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
});