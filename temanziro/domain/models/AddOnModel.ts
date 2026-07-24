import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface AddOnsModel {
    uid: string;
    add_on: {
        add_on_name: string;
        add_on_type: string;
    };
    is_active: boolean;
}

export interface DocumentationAddOnsModel {
    uid: string;
    url_portfolio: string;
    is_verified: boolean;
    portfolio_rejection_message?: string;
    created_at: FirebaseFirestoreTypes.Timestamp | null;
    updated_at: FirebaseFirestoreTypes.Timestamp | null;
}

export interface TransportationAddOnsModel {
    uid: string;
    transportation_type: string;
    transportation_model: string;
    transportation_license_plate: string;
    is_verified: boolean;
    created_at: FirebaseFirestoreTypes.Timestamp | null;
    updated_at: FirebaseFirestoreTypes.Timestamp | null;
}

export interface CompanionTransportationDocumentModel {
    uid: string;
    url_sim: string;
    sim_status: string;
    sim_rejection_message?: string;
    url_stnk: string;
    stnk_status: string;
    stnk_rejection_message?: string;
    url_photo_vehicle_front: string;
    vehicle_front_status: string;
    vehicle_front_rejection_message?: string;
    url_photo_vehicle_side: string;
    vehicle_side_status: string;
    vehicle_side_rejection_message?: string;
}