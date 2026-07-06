import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    elevation: 2,
    height: 50,
    overflow: "hidden",
  },
  prefixContainer: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  prefixText: {
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 15,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  uploadSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },

  spacer: {
    flex: 1,
    minHeight: 40,
  },
  buttonSubmit: {
    marginBottom: 12,
  },
  buttonSkip: {
    // Styling tambahan jika diperlukan untuk tombol skip
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-end", // Memosisikan tombol hapus merapat ke kanan bawah container
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline", // Memberikan efek underline agar terlihat seperti text-link clickable
  },
});
