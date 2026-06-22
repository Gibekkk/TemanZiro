import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
});

export const LoginRepository = {
    async signInWithGoogle() {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            const idToken = response?.data ? response.data.idToken : (response as any).idToken;

            if (!idToken) {
                throw new Error("Google Sign-In failed: No ID Token retrieved.");
            }

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            const userCredential = await auth().signInWithCredential(googleCredential);
            return userCredential.user;
        } catch (error) {
            console.error("Google Sign-In Error in Repository:", error);
            throw error;
        }
    },

    async signOut() {
        try {
            await auth().signOut();
            await GoogleSignin.signOut();
        } catch (error) {
            console.error("Sign-Out Error in Repository:", error);
            throw error;
        }
    }
};
