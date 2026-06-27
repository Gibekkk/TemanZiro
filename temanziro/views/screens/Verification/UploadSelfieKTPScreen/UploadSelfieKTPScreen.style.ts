import { StyleSheet } from "react-native";
import { COMMON_COLORS, FONTS } from "@/constants/Theme";

export default StyleSheet.create({
  title: {
    color: COMMON_COLORS.textPrimary,
    fontFamily: `${FONTS.quicksand}-Bold`,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 25,
  },
  subtitle: {
    color: COMMON_COLORS.textSecondary,
    fontFamily: FONTS.montserrat,
    fontWeight: "500",
    fontSize: 13,
    marginTop: 10,
    lineHeight: 20, // Menambahkan line-height agar teks lebih mudah dibaca
  },
  buttonSend: {
    marginTop: 20,
  },
  buttonSkip: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
  },
  buttonSkipText: {
    color: COMMON_COLORS.textPrimary,
  },
  footerScreen: {
    fontSize: 14,
    color: COMMON_COLORS.textSecondary,
    fontFamily: FONTS.montserrat,
    textAlign: "center",
    marginBottom: 40, // Memberikan jarak dari bawah layar agar bisa di-scroll
  },
  containerselfiektpimg: {
    
  }
});
