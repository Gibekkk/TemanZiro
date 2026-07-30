import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/Theme";

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    headerSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: "bold",
        fontFamily: `${FONTS.quicksand}-Bold`,
        color: "#0f172a",
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 14,
        fontFamily: FONTS.quicksand,
        color: "#64748b",
        lineHeight: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeaderTitle: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: FONTS.quicksand,
        letterSpacing: 1.2,
        marginBottom: 8,
        marginLeft: 20,
        color: "#8C7A6B",
    },
    
    // Subtitle menu styles
    menuTitleWrapper: {
        flexDirection: "column",
        justifyContent: "center",
        paddingVertical: 4,
    },
    menuTitleText: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
        color: "#0f172a",
    },
    menuSubtitleText: {
        fontSize: 12,
        fontFamily: FONTS.quicksand,
        color: "#e96100",
        marginTop: 2,
    },

    // Transportation Custom Component
    transCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 16,
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: "rgba(240, 240, 240, 0.8)",
        overflow: "hidden",
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        padding: 4,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    tabButtonActive: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
        color: "#64748b",
    },
    tabTextActive: {
        color: "#E96100", // Accent color matching tabs
    },
    docRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(243, 244, 246, 0.9)",
        marginHorizontal: 16,
    },
    docLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    docIconWrapper: {
        marginRight: 16,
    },
    docTitle: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
        color: "#0f172a",
    },
    docRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    docStatusText: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
        color: "#e11d48", // Unuploaded/danger red
    },
    arrowIcon: {
        opacity: 0.5,
    },

    // Vehicle image uploader
    photoLabel: {
        fontSize: 13,
        fontWeight: "700",
        fontFamily: FONTS.quicksand,
        color: "#475569",
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    photoGrid: {
        flexDirection: "row",
        marginHorizontal: 16,
        gap: 12,
    },
    photoUploadBox: {
        flex: 1,
        height: 140,
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#CBD5E1",
        backgroundColor: "#F8FAFC",
        alignItems: "center",
        justifyContent: "center",
    },
    photoUploadBoxActive: {
        borderColor: "#E96100",
        backgroundColor: "rgba(233, 97, 0, 0.02)",
    },
    photoBgImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.06, // Faded background vehicle outline
        borderRadius: 12,
    },
    uploadCenter: {
        alignItems: "center",
        justifyContent: "center",
    },
    uploadIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(233, 97, 0, 0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    uploadText: {
        fontSize: 12,
        fontWeight: "600",
        fontFamily: FONTS.quicksand,
        color: "#8C7A6B",
    },

    // Form inputs
    inputGroup: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: FONTS.quicksand,
        color: "#64748b",
        letterSpacing: 1,
        marginBottom: 6,
    },
    inputField: {
        backgroundColor: "#F1F5F9",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        fontFamily: FONTS.quicksand,
        color: "#0f172a",
        borderWidth: 1,
        borderColor: "transparent",
    },

    // Banner and Submit Button
    bannerContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(233, 97, 0, 0.05)",
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 16,
        marginTop: 24,
        gap: 10,
        alignItems: "center",
    },
    bannerText: {
        flex: 1,
        fontSize: 12,
        fontFamily: FONTS.quicksand,
        color: "#A75D00",
        lineHeight: 18,
    },
    submitButton: {
        backgroundColor: "#A75D00", // Darker orange/brown color from mockup
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 36,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: FONTS.quicksand,
        color: "#FFFFFF",
    },
});
