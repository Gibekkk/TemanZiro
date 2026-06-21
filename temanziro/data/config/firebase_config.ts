// import { initializeApp } from "firebase/app";
import authModule from '@react-native-firebase/auth';
import firestoreModule from '@react-native-firebase/firestore';
import storageModule from '@react-native-firebase/storage';
import databaseModule from '@react-native-firebase/database';

// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
//   databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL as string,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string,
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string,
// };

// const app = initializeApp(firebaseConfig);

export const auth = authModule();
export const db = firestoreModule();
export const storage = storageModule();
export const rtdb = databaseModule();