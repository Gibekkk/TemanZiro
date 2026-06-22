import React, { createContext, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { LoginRepository } from "@/data/repositories/LoginRepository";

interface AuthContextType {
    currentUser: FirebaseAuthTypes.User | null;
    authLoading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    authLoading: true,
    loginWithGoogle: async () => { },
    logout: async () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const loginWithGoogle = async () => {
        try {
            await LoginRepository.signInWithGoogle();
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async () => {
        try {
            await LoginRepository.signOut();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const unsub = auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setAuthLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, authLoading, loginWithGoogle, logout }}>
            {!authLoading && children}
        </AuthContext.Provider>
    );
}