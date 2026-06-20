import React, { createContext, useEffect, useState, useContext } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/data/config/firebase_config";

interface AuthContextType {
    currentUser: User | null;
    authLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ currentUser: null, authLoading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
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