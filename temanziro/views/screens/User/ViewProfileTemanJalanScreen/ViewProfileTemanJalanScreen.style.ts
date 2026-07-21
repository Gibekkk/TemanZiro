import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: "center",
  },
  
  // --- Hero Section ---
  heroWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  heroSection: {
    position: "relative",
    width: "90%",
    height: 450,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 3,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  statsBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#FDF1E8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statsBadgeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D9692A",
  },
  profileInfo: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  ratingHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  ratingHeroText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  // --- Content Section ---
  contentSection: {
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 24,
    marginTop: -30,
    zIndex: 3,
  },
  section: {
    marginBottom: 35,
  },
  sectionNoBottomMargin: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  memberDate: {
    fontSize: 13,
    fontWeight: "500",
  },
  line: {
    width: "100%",
    height: 1,
    marginVertical: 15,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },

  // --- Activities Grid ---
  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
  },

  // --- Footer ---
  bottomBar: {
    width: "100%",
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
  },
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});