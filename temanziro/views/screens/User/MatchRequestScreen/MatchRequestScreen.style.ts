import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 16,
  },

  // --- Text Information ---
  textInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  // --- Request Summary Card ---
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 90,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#696969",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryHeader: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 1.2,
    marginBottom: 20,
  },

  // --- Footer Fixed ---
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 30,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  buttonSkip: {
    width: "100%",
  },
  centerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#64748B",
  },
});
