import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    alignItems: "center",     // Membuat avatar dan teks pas di tengah secara vertikal
    justifyContent: "center",
    gap: 6,                   // Memberikan jarak konstan antara avatar dan teks label
  },
  userAvatarWrapper: {
    width: 40, 
    height: 40,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    width: 100
  },
});