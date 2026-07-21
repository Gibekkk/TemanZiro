import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  
  // --- CARD & SHADOW ---
  card: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  // --- NAVIGASI ---
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  navBtn: {
    backgroundColor: "#FFFFFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  navIconText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  selectors: {
    flexDirection: "row",
    gap: 8,
  },
  modeSelector: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  modeSelectorText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  activeMode: {
    borderColor: "#D77636",
  },
  activeModeText: {
    color: "#D77636",
  },

  // --- GRID HARI & TANGGAL ---
  gridDayName: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dayNameCell: {
    width: "14.28%",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  gridDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8, // Memberi jarak vertikal antar baris tanggal
  },
  dayCell: {
    width: "11.70%", // 100% dibagi 7 hari
    aspectRatio: 1, // Memastikan bentuknya persegi
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  dayCellText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  // --- STATUS TANGGAL (Kondisional) ---
  otherMonth: {
    color: "#CBD5E1",
  },
  today: {
    borderColor: "#D77636",
  },
  selected: {
    backgroundColor: "#D77636",
    borderColor: "#D77636",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  inRange: {
    backgroundColor: "#F8EFEA",
    borderRadius: 8, // Persegi untuk yang berada di tengah range
  },
  inRangeText: {
    color: "#D77636",
  },

  // --- GRID LIST (Bulan & Tahun) ---
  gridList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    marginTop: 10,
  },
  listCell: {
    width: "31%", // Agar muat 3 kolom dengan sisa space untuk gap
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  listCellText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  arrowIcon: {
    fontSize: 10, // Atur seberapa kecil panah yang kamu inginkan (default teksmu adalah 15)
  },
});