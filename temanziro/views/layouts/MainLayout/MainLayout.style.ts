import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1 },
  screen: { flexGrow: 1 },
  headerWrapper: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  brandTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#ffffff" 
  },
  userProfileWrapper: { 
    flexDirection: "row", 
    gap: 12, 
    alignItems: "center" 
  },
});
