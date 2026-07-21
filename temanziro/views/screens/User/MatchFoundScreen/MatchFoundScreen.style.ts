import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // --- Profile Card ---
  profileCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 30,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  // --- Image Section ---
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 370,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bgGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
  verifiedBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  verifiedText: {
    color: "#D9692A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // --- Card Body ---
  cardBody: {
    padding: 24,
  },

  // --- Header Row ---
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  nameColumn: {
    flexDirection: "column",
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  matchType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  matchTypeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  // --- Sections ---
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  // --- Activity Box ---
  activityBox: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  activityDetails: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "600",
  },
  activityLocation: {
    fontSize: 13,
  },

  // --- Key Vibes ---
  vibesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  vibePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  vibePillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // --- Action Buttons ---
  buttonProfile: {
    width: "100%",
    marginBottom: 16,
  },
  buttonHome: {
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
});