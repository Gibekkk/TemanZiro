import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    marginVertical: 8,
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(233, 97, 0, 0.1)", // translucent primary/orange color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: `${FONTS.montserrat}-Bold`,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: `${FONTS.quicksand}-Regular`,
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 14,
  },
  action: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 36,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: `${FONTS.quicksand}-Bold`,
    fontWeight: "700",
  },
});
