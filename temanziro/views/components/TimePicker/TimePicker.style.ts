import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 16,
    width: "100%",
    marginVertical: 20,
  },
  mainHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  expandedContent: {
    marginTop: 24,
    flexDirection: "column",
    gap: 16,
  },
  timeDisplayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  timeSubLabel: {
    fontSize: 12,
  },
  timeBoxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeBox: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  timeBoxText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 200, // Diubah menjadi 200 agar memuat 5 angka
    borderWidth: 1.5,
    borderRadius: 12,
    marginHorizontal: 12,
    position: "relative",
    overflow: "hidden",
  },
  pickerHighlightBar: {
    position: "absolute",
    top: 80, // Diubah ke posisi 80 (item ketiga alias posisi tengah dari 5 item)
    left: 0,
    right: 0,
    height: 40,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    zIndex: -1,
  },
  pickerSeparatorText: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  wheelCol: {
    height: 200, // Diubah menjadi 200 untuk ruang gerak 5 angka
    width: 60,
  },
  wheelItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  wheelText: {
    fontSize: 18,
    fontWeight: "500",
  },
  wheelTextActive: {
    fontSize: 22,
    fontWeight: "bold",
  },
  wheelLabel: {
    fontSize: 12,
  },
});