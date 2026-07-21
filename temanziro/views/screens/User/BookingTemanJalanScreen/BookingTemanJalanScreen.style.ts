import { FONTS } from "@/constants/Theme";
import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
// Another Style
  spaceBottom: {
    paddingBottom: 140
  },

  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Memberikan ruang lega agar komponen terbawah tidak tertutup footer
  },

  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20, // Memberi jarak dari komponen di atasnya
  },
  badge: {
    backgroundColor: "#F8EFEA",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  badgeText: {
    color: "#D77636",
    fontWeight: "600",
    fontSize: 14,
  },

  // --- Area Date Result ---
  resultDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 16,
    marginHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // --- Footer Fixed ---
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16, // Penyesuaian safe area bawah iOS
    borderTopWidth: 1,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    minWidth: 160,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    color: "#64748b",
    fontFamily: `${FONTS.quicksand}-Bold`,
  },
});
