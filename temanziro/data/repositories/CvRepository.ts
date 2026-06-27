import { generateFileName, normalizeLocalUri } from "@/data/repositories/utils/UploadFileUtils";
import storage from '@react-native-firebase/storage';

export const CvRepository = {
    async uploadCvDocument(userUid: string, localUri: string, filename: string): Promise<string> {
        try {
            const cleanUri = normalizeLocalUri(localUri);
            const extension = generateFileName(filename);

            const fileName = `${userUid}${extension}`;
            const fullPath = `cv/${fileName}`;

            const reference = storage().ref(fullPath);
            await reference.putFile(cleanUri);

            return await reference.getDownloadURL();
        } catch (error) {
            console.error('Error uploading CV document to storage:', error);
            throw error;
        }
    }
};