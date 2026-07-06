import { StyleSheet } from "react-native";
import { COMMON_COLORS } from "@/constants/Theme";

export const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(249, 115, 22, 0.05)",
    borderRadius: 100,
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: COMMON_COLORS.border,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COMMON_COLORS.primary,
    padding: 0,
  },
});