import { StyleSheet } from "react-native";

export default StyleSheet.create({
  content: {
    width: "100%",
  },

  // --- RATING HEADER ---
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    width: "100%",
  },
  overallRating: {
    textAlign: "center",
    width: "40%",
    fontSize: 48,
    fontWeight: "800",
  },
  ratingBars: {
    flex: 1,
    flexDirection: "column",
    gap: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingStarText: {
    fontSize: 12,
    fontWeight: "700",
    width: 12,
  },
  ratingCountText: {
    fontSize: 12,
    fontWeight: "700",
    width: 24,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },

  // --- REVIEW CARDS ---
  reviewScrollContainer: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 12,
    paddingRight: 24, 
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    width: 280,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "800",
    flexShrink: 1,
  },
  reviewStar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewStarText: {
    fontSize: 14,
    fontWeight: "800",
  },
  reviewText: {
    fontSize: 12,
    lineHeight: 18,
  },
});