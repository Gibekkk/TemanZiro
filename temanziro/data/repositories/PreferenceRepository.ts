import { PreferenceList } from "@/domain/models/PreferenceModel";
import firestore from "@react-native-firebase/firestore";

export const PreferenceRepository = {
    async getPreferenceList(): Promise<PreferenceList> {
        try {
            const docSnap = await firestore().collection("preference_list").doc("list").get();
            if (!docSnap.exists) {
                return { preference_names: [] };
            }
            return docSnap.data() as PreferenceList;
        } catch (error) {
            console.error("Error fetching preference list:", error);
            throw error;
        }
    },

    subscribePreferenceList(callback: (list: PreferenceList) => void): () => void {
        return firestore().collection("preference_list").doc("list").onSnapshot((docSnap) => {
            if (!docSnap.exists) {
                callback({ preference_names: [] });
            } else {
                callback(docSnap.data() as PreferenceList);
            }
        },
            (error) => {
                console.error("Error subscribing to preference list:", error);
            });
    },

    async updatePreferenceList(data: PreferenceList): Promise<void> {
        try {
            await firestore().collection("preference_list").doc("list").set({
                ...data,
            }, { merge: true });
        } catch (error) {
            console.error("Error updating preference list:", error);
            throw error;
        }
    }
};