import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { DocumentationAddOnsModel, TransportationAddOnsModel, CompanionTransportationDocumentModel } from "@/domain/models/AddOnModel";
import { generateFileName, normalizeLocalUri } from "@/data/repositories/utils/UploadFileUtils";
import { AddOnStatus } from "@/constants/AddOnConstant";

export const AddOnRepository = {
    getAddOnTypeCollection(companionUid: string, addOnType: string) {
        return firestore()
                .collection("add_on")
                .doc(companionUid)
                .collection(addOnType)

    },

    async getAddOnActivityStatus(companionUid: string, addOnType: string): Promise<AddOnStatus | null> {
        try {
            const docSnap = await this.getAddOnTypeCollection(companionUid, addOnType).doc("data").get();
            if (!docSnap.exists) return null;
            const data = docSnap.data();
            return data?.is_active || false;
        } catch (error) {
            console.error("Error fetching add-on activity status:", error);
            throw error;
        }
    },

    async updateAddOnActiveStatus(companionUid: string, addOnType: string, addOnName: string, isActive: boolean ): Promise<void> {
        try {
            await this.getAddOnTypeCollection(companionUid, addOnType).doc("data").set({
                uid: companionUid,
                add_on: {
                    add_on_name: addOnName,
                    add_on_type: addOnType,
                },
                is_active: isActive,
                updated_at: firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error(`Error updating add-on active status (${addOnType}):`, error);
            throw error;
        }
    },

    async getDocumentationDetails(companionUid: string): Promise<DocumentationAddOnsModel | null> {
        try {
            const docSnap = await this.getAddOnTypeCollection(companionUid, "documentation").doc("data").get();
            if (!docSnap.exists) return null;
            return docSnap.data() as DocumentationAddOnsModel;
        } catch (error) {
            console.error("Error fetching documentation details:", error);
            throw error;
        }
    },

    async updateDocumentationDetails(companionUid: string, data: Partial<DocumentationAddOnsModel>): Promise<void> {
        try {
            await this.getAddOnTypeCollection(companionUid, "documentation").doc("data").set({
                uid: companionUid,
                ...data,
                updated_at: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("Error updating documentation details:", error);
            throw error;
        }
    },

    async getTransportationDetails(companionUid: string): Promise<TransportationAddOnsModel | null> {
        try {
            const docSnap = await this.getAddOnTypeCollection(companionUid, "transportation").doc("data").get();
            if (!docSnap.exists) return null;
            return docSnap.data() as TransportationAddOnsModel;
        } catch (error) {
            console.error("Error fetching transportation details:", error);
            throw error;
        }
    },
    async updateTransportationDetails(companionUid: string, data: Partial<TransportationAddOnsModel>): Promise<void> {
        try {
            await this.getAddOnTypeCollection(companionUid, "transportation").doc("data").set({
                uid: companionUid,
                ...data,
                updated_at: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("Error updating transportation details:", error);
            throw error;
        }
    },

    async getTransportationDocuments(companionUid: string): Promise<CompanionTransportationDocumentModel | null> {
        try {
            const docSnap = await this.getAddOnTypeCollection(companionUid, "transportation").doc("documents").get();
            if (!docSnap.exists) return null;
            return docSnap.data() as CompanionTransportationDocumentModel;
        } catch (error) {
            console.error("Error fetching transportation documents:", error);
            throw error;
        }
    },
    async submitTransportationDocuments(
        companionUid: string, 
        data: Partial<CompanionTransportationDocumentModel>
    ): Promise<void> {
        try {
            await this.getAddOnTypeCollection(companionUid, "transportation").doc("documents").set({
                uid: companionUid,
                ...data
            }, { merge: true });
        } catch (error) {
            console.error("Error submitting transportation documents:", error);
            throw error;
        }
    },

    async uploadTransportationFile(
        companionUid: string, 
        documentType: "sim" | "stnk" | "vehicle_front" | "vehicle_side", 
        localUri: string, 
        originalFileName: string
    ): Promise<string> {
        try {
            const cleanUri = normalizeLocalUri(localUri);
            const extension = generateFileName(originalFileName);
            const fileName = `${documentType}${extension}`;
            const fullPath = `addons/transportation/${companionUid}/${fileName}`;
            const reference = storage().ref(fullPath);
            await reference.putFile(cleanUri);
            return await reference.getDownloadURL();
        } catch (error) {
            console.error(`Error uploading file (${documentType}) to Storage:`, error);
            throw error;
        }
    },

    async updateGeneralAddonStatus(companionUid: string, status: AddOnStatus): Promise<void> {
        try {
            await firestore().collection("profile_companion").doc(companionUid).update({
                addon_status: status,
                updated_at: firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating general add-on status on profile:", error);
            throw error;
        }
    }
}