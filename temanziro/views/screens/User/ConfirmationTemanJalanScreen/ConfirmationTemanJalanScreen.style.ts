import { StyleSheet, Platform, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 12,
  },

  // --- Profile Card ---
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedText: {
    color: "#D9692A",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // --- Activity Summary ---
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    flexDirection: "column",
    gap: 2,
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  itemSubtitle: {
    fontSize: 13,
  },
  divider: {
    borderTopWidth: 0.5,
    marginVertical: 4,
  },
  mapPlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // --- Session Notes ---
  notesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    minHeight: 100,
  },
  notesInput: {
    fontSize: 14,
    minHeight: 60,
  },
  helperText: {
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },

  // --- Safety Banner ---
  safetyBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 24,
    borderWidth: 1,
    gap: 12,
  },
  safetyIcon: {
    marginTop: 2,
  },
  safetyTextContainer: {
    flex: 1,
    gap: 4,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  safetyDesc: {
    fontSize: 12,
    lineHeight: 18,
  },

  // --- Pricing Section ---
  pricingSection: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
  },

  // --- Footer ---
  bottomBar: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  buttonAction: {
    width: "100%",
    marginBottom: 12,
  },
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonBack: {
    backgroundColor: "transparent",
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },

  // --- Modal Bottom Sheet ---
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: height * 0.8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 24,
  },
  popupContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  paymentImage: {
    width: 150,
    height: 150,
  },
  popupDesc: {
    marginLeft: 20,
    flex: 1,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  popupLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
  },
  valueTotalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  popupButton: {
    width: "100%",
  },
});