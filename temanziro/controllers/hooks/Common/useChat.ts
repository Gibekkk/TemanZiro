import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { ChatRepository } from "@/data/repositories/ChatRepository";
import { ChatMessage } from "@/domain/models/ChatModel";
import { USE_DUMMY_DATA, DUMMY_MESSAGES_MAP } from "@/constants/Config";
import firestore from "@react-native-firebase/firestore";
import { BookingRepository } from "@/data/repositories/BookingRepository";
import { Bookings } from "@/domain/models/BookingModel";

export function useChat() {
    const { currentUser } = useAuth();
    const { role } = useUserProfile();

    const params = useLocalSearchParams() as {
        companionId?: string;
        companionName?: string;
        companionAvatar?: string;
        bookingStatus?: string;
        lastChat?: string;
        bookingId?: string;
    };

    const companionId = params.companionId || "";
    const companionName = params.companionName || "User";
    const companionAvatar = params.companionAvatar || "";

    const isCompanion = role === "companion";

    const userUid = isCompanion ? companionId : (currentUser?.uid || "");
    const companionUid = isCompanion ? (currentUser?.uid || "") : companionId;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [bookingId, setBookingId] = useState<string | null>(params.bookingId || null);
    const [bookingDetails, setBookingDetails] = useState<Bookings | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (USE_DUMMY_DATA) {
            const dummyMsgs = DUMMY_MESSAGES_MAP[companionId] || [
                {
                    id: "default_1",
                    chat: params.lastChat || "Halo!",
                    sender_is_user: true,
                    created_at: { toDate: () => new Date() } as any,
                    reference_booking: null as any,
                }
            ];
            setMessages(dummyMsgs);
            setLoading(false);
            return;
        }

        if (!userUid || !companionUid) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = ChatRepository.subscribeMessagesAsUser(
            userUid,
            companionUid,
            (fetchedMessages) => {
                setMessages(fetchedMessages);
                setLoading(false);
            },
            (error) => {
                console.error("useChat subscribeMessages error:", error);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [userUid, companionUid, companionId, params.lastChat]);

    useEffect(() => {
        if (USE_DUMMY_DATA) return;

        if (params.bookingId) {
            setBookingId(params.bookingId);
            return;
        }

        const lastMsgWithBooking = messages.find(m => m.reference_booking?.id);
        if (lastMsgWithBooking && lastMsgWithBooking.reference_booking) {
            setBookingId(lastMsgWithBooking.reference_booking.id);
        } else if (userUid) {
            firestore()
                .collection('bookings')
                .doc(userUid)
                .collection('booking')
                .orderBy('created_at', 'desc')
                .limit(1)
                .get()
                .then((querySnap) => {
                    if (!querySnap.empty) {
                        setBookingId(querySnap.docs[0].id);
                    }
                })
                .catch((err) => {
                    console.error("useChat useEffect fallback booking query error:", err);
                });
        }
    }, [messages, params.bookingId, userUid]);

    useEffect(() => {
        if (USE_DUMMY_DATA || !bookingId) return;

        const unsubscribe = BookingRepository.subscribeBookingDetails(bookingId, (details) => {
            setBookingDetails(details);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [bookingId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const getScheduledDate = (dateTimestamp: any, timeString: string) => {
        if (!dateTimestamp) return null;
        const date = typeof dateTimestamp.toDate === "function" ? dateTimestamp.toDate() : new Date(dateTimestamp);
        if (!timeString) return date;

        const [hours, minutes] = timeString.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
            const mergedDate = new Date(date);
            mergedDate.setHours(hours, minutes, 0, 0);
            return mergedDate;
        }
        return date;
    };

    const getDynamicBookingStatus = () => {
        if (USE_DUMMY_DATA) {
            return params.bookingStatus || "";
        }

        if (!bookingDetails) {
            return params.bookingStatus || "";
        }

        const now = currentTime;
        const start = getScheduledDate(bookingDetails.schedule?.start_date, bookingDetails.schedule?.start_time);
        const end = getScheduledDate(bookingDetails.schedule?.end_date, bookingDetails.schedule?.end_time);

        const status = bookingDetails.booking_status;
        if (status === "konfirmasi" || status === "berlangsung") {
            if (start && end) {
                if (now >= start && now <= end) {
                    return "berlangsung";
                } else if (now > end) {
                    return "selesai";
                }
            }
        }
        return status;
    };

    const dynamicBookingStatus = getDynamicBookingStatus();

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const senderIsUser = !isCompanion;

        if (USE_DUMMY_DATA) {
            const newMsg: ChatMessage = {
                id: `msg_${Date.now()}`,
                chat: text,
                sender_is_user: senderIsUser,
                created_at: { toDate: () => new Date() } as any,
                reference_booking: null as any,
            };
            setMessages((prev) => [...prev, newMsg]);
            return;
        }

        try {
            let finalBookingId = bookingId;
            if (!finalBookingId) {
                const lastMsgWithBooking = messages.find(m => m.reference_booking?.id);
                if (lastMsgWithBooking && lastMsgWithBooking.reference_booking) {
                    finalBookingId = lastMsgWithBooking.reference_booking.id;
                } else if (params.bookingId) {
                    finalBookingId = params.bookingId;
                }
            }

            await ChatRepository.sendMessage(
                userUid,
                companionUid,
                finalBookingId,
                text,
                senderIsUser
            );
        } catch (error) {
            console.error("useChat sendMessage error:", error);
        }
    };

    const formatMessageTime = (timestamp: any) => {
        if (!timestamp) return "";
        try {
            const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            console.error("useChat formatMessageTime error:", error);
            return "";
        }
    };

    const getCombinedMessages = (): any[] => {
        if (USE_DUMMY_DATA) {
            const initialMsgs = DUMMY_MESSAGES_MAP[companionId] || [];
            if (initialMsgs.length === 0) return [];

            const capsules: any[] = [];
            const firstMsgTime = initialMsgs[0]?.created_at;
            const lastMsgTime = initialMsgs[initialMsgs.length - 1]?.created_at;

            const firstTime = typeof firstMsgTime?.toDate === "function" ? firstMsgTime.toDate() : new Date((firstMsgTime as any) || Date.now());
            capsules.push({
                id: `capsule_konfirmasi_${companionId}`,
                isSystem: true,
                status: "konfirmasi",
                created_at: { toDate: () => new Date(firstTime.getTime() - 60000) } as any,
            });

            const currentStatus = params.bookingStatus || "konfirmasi";
            if (currentStatus === "berlangsung" || currentStatus === "selesai") {
                const middleTime = lastMsgTime
                    ? (typeof lastMsgTime.toDate === "function" ? lastMsgTime.toDate() : new Date(lastMsgTime as any))
                    : new Date();
                capsules.push({
                    id: `capsule_berlangsung_${companionId}`,
                    isSystem: true,
                    status: "berlangsung",
                    created_at: { toDate: () => new Date(middleTime.getTime() - 30000) } as any,
                });
            }

            if (currentStatus === "selesai") {
                const finalTime = lastMsgTime
                    ? (typeof lastMsgTime.toDate === "function" ? lastMsgTime.toDate() : new Date(lastMsgTime as any))
                    : new Date();
                capsules.push({
                    id: `capsule_selesai_${companionId}`,
                    isSystem: true,
                    status: "selesai",
                    created_at: { toDate: () => new Date(finalTime.getTime() + 30000) } as any,
                });
            }

            const merged = [...initialMsgs, ...capsules];
            merged.sort((a, b) => {
                const timeA = typeof a.created_at?.toDate === "function"
                    ? a.created_at.toDate().getTime()
                    : (a.created_at ? new Date(a.created_at as any).getTime() : Date.now());
                const timeB = typeof b.created_at?.toDate === "function"
                    ? b.created_at.toDate().getTime()
                    : (b.created_at ? new Date(b.created_at as any).getTime() : Date.now());
                return timeA - timeB;
            });
            return merged;
        }

        if (!bookingDetails) {
            return messages;
        }

        const capsules: any[] = [];
        const start = getScheduledDate(bookingDetails.schedule?.start_date, bookingDetails.schedule?.start_time);
        const end = getScheduledDate(bookingDetails.schedule?.end_date, bookingDetails.schedule?.end_time);

        const bookingCreatedTime = bookingDetails.created_at?.toDate() || new Date(Date.now() - 24 * 3600 * 1000);
        capsules.push({
            id: `capsule_konfirmasi_${bookingId}`,
            isSystem: true,
            status: "konfirmasi",
            created_at: { toDate: () => bookingCreatedTime } as any,
        });

        const now = currentTime;
        const dbStatus = bookingDetails.booking_status;
        if (dbStatus === "berlangsung" || dbStatus === "selesai" || (start && now >= start)) {
            const startEventTime = start || new Date(bookingCreatedTime.getTime() + 3600 * 1000);
            capsules.push({
                id: `capsule_berlangsung_${bookingId}`,
                isSystem: true,
                status: "berlangsung",
                created_at: { toDate: () => startEventTime } as any,
            });
        }

        if (dbStatus === "selesai" || (end && now > end)) {
            const endEventTime = end || new Date(bookingCreatedTime.getTime() + 2 * 3600 * 1000);
            capsules.push({
                id: `capsule_selesai_${bookingId}`,
                isSystem: true,
                status: "selesai",
                created_at: { toDate: () => endEventTime } as any,
            });
        }

        const merged = [...messages, ...capsules];
        merged.sort((a, b) => {
            const timeA = typeof a.created_at?.toDate === "function"
                ? a.created_at.toDate().getTime()
                : (a.created_at ? new Date(a.created_at as any).getTime() : Date.now());
            const timeB = typeof b.created_at?.toDate === "function"
                ? b.created_at.toDate().getTime()
                : (b.created_at ? new Date(b.created_at as any).getTime() : Date.now());
            return timeA - timeB;
        });

        return merged;
    };

    return {
        messages: getCombinedMessages(),
        loading,
        companionName,
        companionAvatar,
        bookingStatus: dynamicBookingStatus,
        isCompanion,
        sendMessage: handleSendMessage,
        formatMessageTime,
    };
}
