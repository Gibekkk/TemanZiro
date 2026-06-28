import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 10,
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
    justifyContent: "space-between", // Menjaga agar elemen sejajar kiri-kanan
    gap: 14,
  },
  timeOption: {
    width: "48%", // Menggantikan grid-template-columns: 1fr 1fr
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  customDayCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  customDayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  customDayHeaderText: {
    fontSize: 14,
    fontWeight: "500",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dayBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  dayBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },
});