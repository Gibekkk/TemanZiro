import { db, rtdb } from "@/data/config/firebase_config";
import { doc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { ref, set, onDisconnect } from "firebase/database";
import { UserOnlineStatus } from "@/domain/models/UserModels";

export const PresenceRepository = {
    setUserPresence: async (uid: string, isOnline: boolean) => {
        try {
            const rtdbRef = ref(rtdb, `online_status/${uid}`);
            const firestoreRef = doc(db, "online_status", uid);

            if (isOnline) {
                await onDisconnect(rtdbRef).set({ is_online: false });
                await set(rtdbRef, { is_online: true });
                await setDoc(firestoreRef, { is_online: true, last_seen: serverTimestamp() }, { merge: true });
            } else {
                await onDisconnect(rtdbRef).cancel();
                await set(rtdbRef, { is_online: false });
                await setDoc(firestoreRef, { is_online: false, last_seen: serverTimestamp() }, { merge: true });
            }
        } catch (error) {
            console.error("Gagal mengupdate presence:", error);
        }
    },

    listenToUserStatus: (targetUid: string, onUpdate: (status: UserOnlineStatus) => void) => {
        const statusRef = doc(db, "online_status", targetUid);
        return onSnapshot(statusRef, (snap) => {
            if (snap.exists()) {
                onUpdate(snap.data() as UserOnlineStatus);
            }
        });
    }
};