// subscribe untuk chat dan list chat
import firestore from '@react-native-firebase/firestore';
import { ChatMessage, ChatRoomMeta } from '@/domain/models/ChatModel';

export const ChatRepository = {
    subscribeMessagesAsUser: (userUid: string, companionUid: string, onUpdate: (messages: ChatMessage[]) => void, onError?: (error: Error) => void) => {
        return firestore()
        .collection('chat')
        .doc(userUid)
        .collection('companion_id')
        .doc(companionUid)
        .collection('chats')
        .orderBy('created_at', 'asc')
        .onSnapshot(
            (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ChatMessage[];
            onUpdate(messages);
            },
            (error) => {
            console.error("ChatRepository Error subscribeMessagesAsUser:", error);
            if (onError) onError(error);
            }
        );
    },

    subscribeUserInbox: (userUid: string, onUpdate: (roomMeta: ChatRoomMeta | null) => void) => {
        return firestore()
        .collection('chat')
        .doc(userUid)
        .onSnapshot((docSnapshot) => {
            if (docSnapshot.exists) {
            onUpdate({
                id: docSnapshot.id,
                ...docSnapshot.data(),
            } as ChatRoomMeta);
            } else {
            onUpdate(null);
            }
        });
    },

    subscribeMessagesAsCompanion: (userUid: string, companionUid: string, onUpdate: (messages: ChatMessage[]) => void) => {
        return ChatRepository.subscribeMessagesAsUser(userUid, companionUid, onUpdate);
    },

    subscribeCompanionInbox: (companionUid: string, onUpdate: (rooms: (ChatRoomMeta & { userUid: string })[]) => void) => {
        return firestore()
        .collection('chat_companion')
        .doc(companionUid)
        .collection('id_user')
        .orderBy('lastchat_datetime', 'desc')
        .onSnapshot((snapshot) => {
            const rooms = snapshot.docs.map((doc) => ({
            userUid: doc.id,
            id: doc.id,
            last_chat: doc.data().last_chat,
            lastchat_datetime: doc.data().lastchat_datetime,
            })) as (ChatRoomMeta & { userUid: string })[];
            onUpdate(rooms);
        });
    },

    sendMessage: async (userUid: string, companionUid: string, bookingId: string, text: string, senderIsUser: boolean): Promise<void> => {
        try {
            const batch = firestore().batch();
            const serverTimestamp = firestore.FieldValue.serverTimestamp();

            const bookingRef = firestore()
                .collection('bookings')
                .doc(userUid)
                .collection('booking')
                .doc(bookingId);

            const messageRef = firestore()
                .collection('chat')
                .doc(userUid)
                .collection('companion_id')
                .doc(companionUid)
                .collection('chats')
                .doc();

            const userMetaRef = firestore()
                .collection('chat')
                .doc(userUid);

            const companionMetaRef = firestore()
                .collection('chat_companion')
                .doc(companionUid)
                .collection('id_user')
                .doc(userUid);

            batch.set(messageRef, {
                chat: text,
                sender_is_user: senderIsUser,
                reference_booking: bookingRef,
                created_at: serverTimestamp,
            });

            batch.set(userMetaRef, {
                last_chat: text,
                lastchat_datetime: serverTimestamp,
            }, { merge: true });

            batch.set(companionMetaRef, {
                last_chat: text,
                lastchat_datetime: serverTimestamp,
            }, { merge: true });

            await batch.commit();
        } catch (error) {
            console.error("ChatRepository Error batch sendMessage :", error);
            throw error;
        }
    },

    resolveBookingData: async (bookingRef: firestore.FirebaseFirestoreTypes.DocumentReference): Promise<any | null> => {
        try {
            const snapshot = await bookingRef.get();
            if (snapshot.exists) {
                return snapshot.data();
            }
        return null;
        } catch (error) {
            console.error("ChatRepository Error resolveBookingData :", error);
            return null;
        }
    }
}