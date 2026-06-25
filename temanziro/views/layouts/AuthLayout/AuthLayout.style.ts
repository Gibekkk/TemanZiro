import { StyleSheet, Dimensions } from "react-native";
// Pastikan path import ini sesuai dengan lokasi file Theme.ts kamu
import { COMMON_COLORS, FONTS } from "@/constants/Theme"; 

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    // Menggunakan constant font ditambah "-Bold" sesuai konfigurasi Expo kamu
    fontFamily: `${FONTS.quicksand}-Bold`, 
    color: COMMON_COLORS.lightText, 
    fontWeight: "bold",
    fontSize: width * 0.08 > 35 ? 35 : width * 0.08,
    marginBottom: 20,
  },
  titleHighlight: {
    color: COMMON_COLORS.secondary, 
  },
  container: {
    flex: 1,
    backgroundColor: COMMON_COLORS.background, 
    paddingVertical: "5%",
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tag: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  tagText: {
    fontFamily: `${FONTS.montserrat}-Bold`, 
    fontWeight: "bold",
    color: COMMON_COLORS.primary, 
    fontSize: width * 0.03 > 14 ? 14 : width * 0.03 > 11 ? width * 0.03 : 11,
  },
  content: {
    flex: 1,
  },
});