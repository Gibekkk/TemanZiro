import firestore from "@react-native-firebase/firestore";
import { UserDetails, UserProfile } from "@/domain/models/UserModels";

export const UserRepository = {
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        try {
            const docSnap = await firestore().collection("profile_user").doc(uid).get();
            if (!docSnap.exists) {
                return null;
            }
            return docSnap.data() as UserProfile;
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error;
        }
    },
    
    subscribeUserProfile(uid: string, callback: (profile: UserProfile | null) => void): () => void {
        return firestore().collection("profile_user").doc(uid).onSnapshot((docSnap) => {
            if (!docSnap.exists) {
                callback(null);
            } else {
                callback(docSnap.data() as UserProfile);
            }
        },  
        (error) => {
            console.error("Error subscribing to user profile:", error);
            }
        );
    },

    async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
        try {
            await firestore().collection("profile_user").doc(uid).set({
                ...data,
                updated_at: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },

    async getUserDetails(uid: string): Promise<UserDetails | null> {
        try {
            const docSnap = await firestore().collection("user_details").doc(uid).get();
            if (!docSnap.exists) {
                return null;
            }
            return docSnap.data() as UserDetails;
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error;
        }
    },

    subscribeUserDetails(uid: string, callback: (details: UserDetails | null) => void): () => void {
        return firestore().collection("user_details").doc(uid).onSnapshot((docSnap) => {
            if (!docSnap.exists) {
                callback(null);
            } else {
                callback(docSnap.data() as UserDetails);
            }
        },  
        (error) => {
            console.error("Error subscribing to user details:", error);
            }
        );
    },

    async updateUserDetails(uid:string, data: Partial<UserDetails>): Promise<void> {
        try {
            await firestore().collection("user_details").doc(uid).set({
                ...data,
                updated_at: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("Error updating user details:", error);
            throw error;
        }
    },
};