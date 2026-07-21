import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    gap: 24,
    marginBottom: 20,
  },

  // --- Slider Area ---
  sliderWrapper: {
    width: "100%",
    alignItems: "center", 
  },
  
  // Konfigurasi Track (Garis)
  trackBg: {
    height: 6,
    borderRadius: 4,
  },
  trackHighlight: {
    height: 6,
    borderRadius: 4,
  },
  
  // Konfigurasi Thumb (Titik)
  thumb: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 3,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  thumbPressed: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },

  // --- Labels ---
  labels: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -10, // Menarik label sedikit ke atas mendekati slider
    paddingHorizontal: 5,
  },
  labelText: {
    color: "#758392",
    fontSize: 13,
    fontWeight: "500",
  },
});