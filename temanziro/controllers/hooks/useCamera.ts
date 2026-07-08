import { useCameraPermissions } from "expo-camera";

export function useCamera() {
    const [permission, requestPermission] = useCameraPermissions();

    const checkAndRequestPermission = async (): Promise<boolean> => {
        if (!permission || !permission.granted) {
            const result = await requestPermission();
            return result.granted;
        }
        return true;
    };

    return {
        permission,
        requestPermission,
        checkAndRequestPermission,
    };
}
