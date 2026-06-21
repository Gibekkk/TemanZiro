import { db, rtdb } from "@/data/config/firebase_config";
import firestore from "@react-native-firebase/firestore";
import database from "@react-native-firebase/database";
import { UserOnlineStatus } from "@/domain/models/UserModels";

export const PresenceRepository = {
    setUserPresence: async (uid: string, isOnline: boolean) => {
        try {
            const rtdbRef = rtdb.ref(`online_status/${uid}`);
            const firestoreRef = db.collection("online_status").doc(uid);

            if (isOnline) {
                await rtdbRef.onDisconnect().set({ 
                    is_online: false, 
                    last_seen: database.ServerValue.TIMESTAMP 
                });
                
                await rtdbRef.set({ 
                    is_online: true, 
                    last_seen: database.ServerValue.TIMESTAMP 
                });
                
                await firestoreRef.set({ 
                    is_online: true, 
                    last_seen: firestore.FieldValue.serverTimestamp() 
                }, { merge: true });
            } else {
                await rtdbRef.onDisconnect().cancel();
                
                await rtdbRef.set({ 
                    is_online: false, 
                    last_seen: database.ServerValue.TIMESTAMP 
                });
                
                await firestoreRef.set({ 
                    is_online: false, 
                    last_seen: firestore.FieldValue.serverTimestamp() 
                }, { merge: true });
            }
        } catch (error) {
            console.error("Gagal mengupdate presence:", error);
        }
    },

    subscribeUserStatus: (targetUid: string, onUpdate: (status: UserOnlineStatus) => void) => {
        const firestoreRef = db.collection("online_status").doc(targetUid);
        return firestoreRef.onSnapshot((snap) => {
            if (snap && snap.exists()) {
                onUpdate(snap.data() as UserOnlineStatus);
            }
        }, (error) => {
            console.error("Error listening to user status:", error);
        });
    }
};
