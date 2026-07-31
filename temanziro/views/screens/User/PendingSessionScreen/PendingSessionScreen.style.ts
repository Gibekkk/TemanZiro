import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  // --- HEADER ---
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
  },

  // --- PAYMENT DETAILS ---
  paymentSection: {
    marginBottom: 16,
  },
  paymentRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },

  // --- ACTIVITY DETAILS ---
  summaryCard: {
    paddingVertical: 16,
    gap: 18,
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
    borderTopWidth: 1,
    marginHorizontal: -24,
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

  // --- SESSION NOTES ---
  notesSection: {
    flexDirection: "column",
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  notesTextarea: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
  },
});