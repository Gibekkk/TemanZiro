import { db } from "@/data/config/firebase_config";
import { doc, onSnapshot } from "firebase/firestore";
import { UserRole } from "@/domain/models/UserModels";

export const UserRepository = {
    listenToUserDetails: (uid: string, callback: (data: any) => void) => {
        const ref = doc(db, "user_details", uid);
        return onSnapshot(ref, (snap) => {
            callback(snap.exists() ? snap.data() : null);
        });
    },

    listenToUserProfile: (uid: string, role: UserRole, callback: (data: any) => void) => {
        const collection = role === "companion" ? "profile_companion" : "profile_user";
        const ref = doc(db, collection, uid);
        return onSnapshot(ref, (snap) => {
            callback(snap.exists() ? snap.data() : null);
        });
    }
};