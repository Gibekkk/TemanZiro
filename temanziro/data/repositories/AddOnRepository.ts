import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { AddOnsModel, CompanionVehicleModel, DocumentationAddOnDetails } from "@/domain/models/AddOnModel";
import { generateFileName, normalizeLocalUri } from "@/data/repositories/utils/UploadFileUtils";
import { AddOnStatus } from "@/constants/AddOnConstant";

export const AddOnRepository = {
    async getAddOns(companionUid: string): Promise<AddOnsModel | null> {
        try {
            const docSnap = await firestore().collection("add_on").doc(companionUid).get();
            if (!docSnap.exists) return null;
            return docSnap.data() as AddOnsModel;
        } catch (error) {
            console.error("Error fetching add-ons:", error);
            throw error;
        }
    },

    async updateAddOnActiveStatus(companionUid: string, addOnType: "documentation" | "transportation", isActive: boolean): Promise<void> {
        try {
            const field = addOnType === "documentation" ? "is_active_documentation" : "is_active_transportation";
            await firestore().collection("add_on").doc(companionUid).set({
                [field]: isActive,
                updated_at: firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error(`Error updating add-on active status (${addOnType}):`, error);
            throw error;
        }
    },

    async updateDocumentationDetails(companionUid: string, data: Partial<DocumentationAddOnDetails>): Promise<void> {
        try {
            const updateData: any = {
                updated_at: firestore.FieldValue.serverTimestamp()
            };
            if (data.url_portfolio !== undefined) updateData["documentation.url_portfolio"] = data.url_portfolio;
            if (data.is_accepted !== undefined) updateData["documentation.is_accepted"] = data.is_accepted;
            if (data.portfolio_rejection_message !== undefined) updateData["documentation.portfolio_rejection_message"] = data.portfolio_rejection_message;
            if (data.created_at !== undefined) updateData["documentation.created_at"] = data.created_at;

            await firestore().collection("add_on").doc(companionUid).set(updateData, { merge: true });
        } catch (error) {
            console.error("Error updating documentation details:", error);
            throw error;
        }
    },

    async saveVehicles(companionUid: string, vehicles: CompanionVehicleModel[]): Promise<void> {
        try {
            await firestore().collection("add_on").doc(companionUid).set({
                vehicles,
                updated_at: firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error saving vehicles list:", error);
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