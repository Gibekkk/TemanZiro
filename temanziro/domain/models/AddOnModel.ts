import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
export interface DocumentationAddOnDetails {
    url_portfolio: string;
    is_accepted: boolean;
    portfolio_rejection_message?: string;
    created_at: FirebaseFirestoreTypes.Timestamp;
    updated_at?: FirebaseFirestoreTypes.Timestamp | null;
}

export interface AddOnsModel {
    uid: string;
    is_active_documentation: boolean;
    is_active_transportation: boolean;
    documentation?: DocumentationAddOnDetails | null;
    vehicles?: CompanionVehicleModel[] | null;
    created_at: FirebaseFirestoreTypes.Timestamp;
    updated_at?: FirebaseFirestoreTypes.Timestamp | null;
}

export interface CompanionVehicleModel {
    id: string;
    type: string;
    model: string;
    license_plate: string;
    is_verified: boolean;
    is_active: boolean;
    url_sim?: string;
    sim_status?: string;
    sim_rejection_message?: string;
    url_stnk?: string;
    stnk_status?: string;
    stnk_rejection_message?: string;
    url_vehicle_front_photo?: string | null;
    vehicle_front_photo_status?: string;
    vehicle_front_rejection_message?: string;
    url_vehicle_side_photo?: string | null;
    vehicle_side_photo_status?: string;
    vehicle_side_photo_rejection_message?: string;
}