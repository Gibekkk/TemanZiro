import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // --- TIMER SECTION ---
  timerSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 18,
  },
  timerGrid: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    width: "100%",
  },
  timerBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    width: (width - 40 - 32) / 3, 
    height: 70,
  },
  timeNum: {
    fontSize: 22,
    fontWeight: "800",
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 20,
  },

  // --- GLOBAL CARD STYLE ---
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tagTodayContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagTodayText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  dotGreen: {
    width: 10,
    height: 10,
    backgroundColor: "#10b981",
    borderRadius: 5,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    marginHorizontal: -16,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  locationInfo: {
    flexDirection: "column",
    gap: 5,
    flex: 1,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  locationSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  // --- COMPANION CARD ---
  companionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  companionInfo: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  companionName: {
    fontSize: 16,
    fontWeight: "800",
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  tagListenerContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tagListenerText: {
    fontSize: 11,
    fontWeight: "800",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // --- BUTTONS ---
  actionArea: {
    marginBottom: 12,
  },
  chatButton: {
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  btnContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // --- MAP ---
  mapWrapper: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mapPlaceholderText: {
    fontSize: 14,
    fontWeight: "500",
  },
});