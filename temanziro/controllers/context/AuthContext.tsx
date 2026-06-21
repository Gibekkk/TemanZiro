import React, { createContext, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface AuthContextType {
    currentUser: FirebaseAuthTypes.User | null;
    authLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ currentUser: null, authLoading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsub = auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setAuthLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, authLoading }}>
            {!authLoading && children}
        </AuthContext.Provider>
    );
}