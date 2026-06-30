import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  headerBody: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  textHeaderWrapper: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 15,
    paddingTop: 5,
    borderRadius: 10
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "bold"
  },
  location: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
    marginLeft: -2
  },
  textSubheader: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
    maxWidth: 185,
  },
  boxHeader: {
    marginTop: 10,
    paddingVertical: 4,
    borderRadius: 8,
    width: "95%",
  },
  textHeaderLabel: {
    fontSize: 14,
    fontWeight: "700"
  },
  mascotImgContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COMMON_COLORS.secondaryBackground,
    overflow: "hidden",
    position: "relative",
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  sectionTitle: {
    fontFamily: `${FONTS.quicksand}-Bold`,
    fontSize: 16,
    color: COMMON_COLORS.textPrimary,
    marginBottom: 10,
    fontWeight: "bold",
  },
  cardWrapper: {
    marginBottom: 15,
  },
  bodySection: {
    padding: 20,
  },
  tierDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
  },
  tierCard: {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: "stretch",
    paddingHorizontal: 8,
    paddingVertical: 10,
  }
});
