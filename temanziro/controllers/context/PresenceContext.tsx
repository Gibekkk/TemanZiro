import React, { createContext, useEffect, useState, useRef, ReactNode, useContext } from "react";
import { AppState, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { AuthContext } from "./AuthContext";
import { PresenceRepository } from "@/data/repositories/PresenceRepository";
import { UserOnlineStatus } from "@/domain/models/UserModels";

interface PresenceContextType {
    isOnline: boolean;
    watchedStatuses: Record<string, UserOnlineStatus>;
    watchUser: (userId: string) => void;
    unwatchUser: (userId: string) => void;
}

export const PresenceContext = createContext<PresenceContextType>({
    isOnline: false,
    watchedStatuses: {},
    watchUser: () => { },
    unwatchUser: () => { },
});

export function PresenceProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useContext(AuthContext);

    const [isOnline, setIsOnline] = useState(false);
    const [watchedStatuses, setWatchedStatuses] = useState<Record<string, UserOnlineStatus>>({});
    const watchedUnsubs = useRef<Record<string, () => void>>({});

    useEffect(() => {
        if (!currentUser?.uid) return;

        const uid = currentUser.uid;

        const updatePresence = (isAppActive: boolean, isNetworkConnected: boolean) => {
            const shouldBeOnline = isAppActive && isNetworkConnected;
            setIsOnline(shouldBeOnline);
            PresenceRepository.setUserPresence(uid, shouldBeOnline);
        };

        let currentAppStatus = AppState.currentState === "active";
        let currentNetworkStatus = true;

        const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
            currentNetworkStatus = !!state.isConnected;
            updatePresence(currentAppStatus, currentNetworkStatus);
        });

        const subscriptionAppState = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
            currentAppStatus = nextAppState === "active";
            updatePresence(currentAppStatus, currentNetworkStatus);
        });

        NetInfo.fetch().then((state) => {
            currentNetworkStatus = !!state.isConnected;
            updatePresence(currentAppStatus, currentNetworkStatus);
        });

        return () => {
            unsubscribeNetInfo();
            subscriptionAppState.remove();
            PresenceRepository.setUserPresence(uid, false);

            Object.values(watchedUnsubs.current).forEach((unsub) => unsub());
            watchedUnsubs.current = {};
        };
    }, [currentUser]);

    const watchUser = (targetUserId: string) => {
        if (watchedUnsubs.current[targetUserId]) return; // Cegah duplikasi listener

        const unsub = PresenceRepository.listenToUserStatus(targetUserId, (status) => {
            setWatchedStatuses((prev) => ({ ...prev, [targetUserId]: status }));
        });

        watchedUnsubs.current[targetUserId] = unsub;
    };

    const unwatchUser = (targetUserId: string) => {
        if (watchedUnsubs.current[targetUserId]) {
            watchedUnsubs.current[targetUserId]();
            delete watchedUnsubs.current[targetUserId];

            setWatchedStatuses((prev) => {
                const newState = { ...prev };
                delete newState[targetUserId];
                return newState;
            });
        }
    };

    return (
        <PresenceContext.Provider value={{ isOnline, watchedStatuses, watchUser, unwatchUser }}>
            {children}
        </PresenceContext.Provider>
    );
}