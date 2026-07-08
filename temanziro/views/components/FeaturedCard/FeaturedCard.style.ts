import { StyleSheet, Dimensions } from "react-native";
import { FONTS } from "@/constants/Theme";

const { width } = Dimensions.get("window");
export const CARD_WIDTH = width * 0.84;
export const CARD_MARGIN = 10;
export const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;

export default StyleSheet.create({
  cardSlide: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  cardBody: {
    marginBottom: 18,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontFamily: `${FONTS.quicksand}-Medium`,
    fontSize: 12,
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
  },
  buttonText: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 12,
    fontWeight: "700",
  },
});
