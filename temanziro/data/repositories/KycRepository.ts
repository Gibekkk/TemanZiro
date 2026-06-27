import { generateFileName, normalizeLocalUri } from "@/data/repositories/utils/UploadFileUtils";
import { KycDocumentType } from "@/constants/UserDetails";
import storage from '@react-native-firebase/storage';

export const KycRepository = {
    async uploadKycToStorage(userUid: string, documentType: KycDocumentType, localUri: string, filename: string) : Promise<string> {
        try {
            const cleanUri = normalizeLocalUri(localUri);
            const extension = generateFileName(filename);

            const fileName = `foto_${documentType}${extension}`;
            const fullPath = `kyc/${userUid}/${fileName}`;

            const reference = storage().ref(fullPath);
            await reference.putFile(cleanUri);
            
            return await reference.getDownloadURL();
        } catch (error) {
            console.error('Error uploading file to storage:', error);
            throw error;
        }
    }
};