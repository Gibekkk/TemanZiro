import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { useTheme } from "@/controllers/hooks/useTheme";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { ChatRepository } from "@/data/repositories/ChatRepository";
import { BOOKING_STATUS } from "@/constants/BookingDetails";
import { USE_DUMMY_DATA, DUMMY_CHATS } from "@/constants/Config";

export function useListChat() {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const { role } = useUserProfile();
    const segments = useSegments() as string[];
    const router = useRouter();

    const isCompanion = segments.includes("(tabs_companion)") || role === "companion";
    const isUser = segments.includes("(tabs)") || role === "booker";

    const [chats, setChats] = useState<any[]>([]);
    const [chatLoading, setChatLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"Aktif" | "Riwayat">("Aktif");

    useEffect(() => {
        if (USE_DUMMY_DATA) {
            setChats(DUMMY_CHATS);
            setChatLoading(false);
            return;
        }

        if (!currentUser?.uid) {
            setChatLoading(false);
            return;
        }

        setChatLoading(true);
        let unsubscribe: () => void;

        if (isCompanion) {
            unsubscribe = ChatRepository.subscribeCompanionInbox(currentUser.uid, (rooms) => {
                setChats(rooms);
                setChatLoading(false);
            });
        } else {
            unsubscribe = ChatRepository.subscribeUserInboxRooms(currentUser.uid, (rooms) => {
                setChats(rooms);
                setChatLoading(false);
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentUser?.uid, isCompanion]);

    const handleFetchData = async (searchText: string) => {
        setSearchQuery(searchText);
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return "Unknown";
        try {
            const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            console.log("Error formatting time:", error);
            return "Unknown";
        }
    };

    const filteredChat = chats.filter((chat) => {
        const name = isCompanion ? chat.name_user : chat.name_companion;
        const matchesSearch = name?.toLowerCase().includes(searchQuery.toLowerCase());

        const isHistory = chat.booking_status === BOOKING_STATUS.SELESAI || chat.booking_status === BOOKING_STATUS.BATAL;
        const matchesTab = activeTab === "Aktif" ? !isHistory : isHistory;

        return (matchesSearch ?? true) && matchesTab;
    });

    const handleChatPress = (chat: any) => {
        router.push({
            pathname: "/common/chatscreen",
            params: {
                companionId: chat.id,
                companionName: isCompanion ? chat.name_user : chat.name_companion,
                companionAvatar: isCompanion ? chat.url_photoprofile_user : chat.url_photoprofile_companion,
                bookingStatus: chat.booking_status,
                lastChat: chat.last_chat,
            }
        });
    };

    return {
        theme,
        isCompanion,
        isUser,
        chatLoading,
        activeTab,
        setActiveTab,
        handleFetchData,
        formatTime,
        filteredChat,
        handleChatPress,
    };
}