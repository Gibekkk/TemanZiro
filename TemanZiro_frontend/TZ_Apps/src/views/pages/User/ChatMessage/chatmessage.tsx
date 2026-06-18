import React, { useEffect, useState, useRef } from "react";
import style from "./chatmessage.module.css";

import IconSend from "@/assets/icon/send.svg";
import IconAdd from "@/assets/icon/add.svg";
import IconBack from "@/assets/icon/back.svg";
import { useAuth } from "@/controllers/hooks/useAuth";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase_config";

interface ChatMessage {
  id: string;
  chat: string;
  reference_booking: string;
  sender_is_user: boolean;
  createdAt: any;
}

export default function ChatRoom() {
  const { userProfile, currentUser, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const chatState = location.state as
    | {
      companionId?: string;
      userId?: string;
      targetId?: string;
      companionName?: string;
      companionAvatar?: string;
      bookingStatus?: string;
      lastChat?: string;
      bookingRefPath?: string;
    }
    | undefined;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isOnline, setIsOnline] = useState(false);

  const isCompanion = role === "companion";
  const isUserRole = role !== "companion";

  const targetId = chatState?.targetId || chatState?.companionId || chatState?.userId;

  const userUid = isCompanion ? targetId : currentUser?.uid;
  const companionUid = isCompanion ? currentUser?.uid : targetId;
  const bookingStatusLower = (chatState?.bookingStatus || "").toLowerCase();
  const canChat = bookingStatusLower === "konfirmasi" || bookingStatusLower === "terkonfirmasi" || bookingStatusLower === "berlangsung";

  useEffect(() => {
    console.log("--- DEBUGGING CHAT ---");
    console.log("Current User UID:", currentUser?.uid);
    console.log("Target ID dari State:", targetId);
    console.log("User UID Path:", userUid);
    console.log("Companion UID Path:", companionUid);
    if (!currentUser || !userUid || !companionUid) {
      console.warn("Gagal Fetch: Ada ID yang masih kosong (undefined).");
      return;
    }

    const chatRef = collection(db, "chat", userUid, "companion_id", companionUid, "chats");
    const q = query(chatRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, [userUid, companionUid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!targetId) return;

    const statusRef = doc(db, "online_status", targetId);

    const unsubscribeStatus = onSnapshot(statusRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsOnline(docSnap.data().is_online === true);
      } else {
        setIsOnline(false);
      }
    });

    return () => unsubscribeStatus();
  }, [targetId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !userUid || !companionUid) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const batch = writeBatch(db);

      // const isCurrentUserAUser = role !== "companion";

      const messageData = {
        chat: messageText,
        reference_booking: chatState?.bookingRefPath || "",
        sender_is_user: isUserRole,
        createdAt: serverTimestamp(),
      };

      const chatCollectionRef = collection(db, "chat", userUid, "companion_id", companionUid, "chats");
      const newChatDoc = doc(chatCollectionRef);
      batch.set(newChatDoc, messageData);

      const userInboxRef = doc(db, "chat", userUid, "companion_id", companionUid);
      batch.set(userInboxRef, {
        last_chat: messageText,
        lastchat_datetime: serverTimestamp(),
      }, { merge: true });

      const companionInboxRef = doc(db, "chat_companion", companionUid, "id_user", userUid);
      batch.set(companionInboxRef, {
        last_chat: messageText,
        lastchat_datetime: serverTimestamp(),
      }, { merge: true });

      await batch.commit();

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDateLabel = (timestamp: any) => {
    if (!timestamp) return "TODAY";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "TODAY";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "YESTERDAY";
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).toUpperCase();
    }
  };

  const avatarCompanion = chatState?.companionAvatar || IMGMiniZiro;
  const avatarSender = isUserRole ? userProfile?.url_photoprofile_user || IMGMiniZiro : userProfile?.url_photoprofile_companion || IMGMiniZiro;


  return (
    <div className={style.chatContainer}>
      <header className={style.chatHeader}>
        <button
          className={`${style.iconBtn} ${style.btnTransparent}`}
          onClick={() => navigate(-1)}
        >
          <img src={IconBack} alt="Back" />
        </button>

        <div className={style.headerAvatarContainer}>
          <img src={avatarCompanion} alt="profile" className={style.headerAvatar} />
        </div>

        <div className={style.headerInfo}>
          <h2 className={style.headerName}>{chatState?.companionName || "Companion"}</h2>
          <p className={style.headerStatus}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </header>

      <div className={style.chatArea}>
        {/* Render Pesan Dinamis dengan Date Divider */}
        {messages.map((msg, index) => {
          const isSender = isUserRole ? msg.sender_is_user === true : msg.sender_is_user === false;

          // Logika Date Divider
          const currentDateLabel = getDateLabel(msg.createdAt);
          const previousMessage = index > 0 ? messages[index - 1] : null;
          const previousDateLabel = previousMessage ? getDateLabel(previousMessage.createdAt) : null;

          // Tampilkan divider jika ini pesan pertama, atau jika tanggalnya berbeda dengan pesan sebelumnya
          const showDivider = currentDateLabel !== previousDateLabel;

          return (
            <React.Fragment key={msg.id}>
              {/* Divider Tanggal */}
              {showDivider && (
                <div className={style.dateDivider}>{currentDateLabel}</div>
              )}

              {/* Baris Pesan */}
              <div
                className={`${style.messageRow} ${isSender ? style.messageSender : style.messageReceiver}`}
              >
                {!isSender && <img src={avatarCompanion} alt="companion" className={style.chatAvatar} />}

                <div className={style.messageContent}>
                  <div className={`${style.bubble} ${isSender ? style.bubbleSender : style.bubbleReceiver}`}>
                    {msg.chat}
                  </div>
                  <div className={style.messageMeta}>{formatTime(msg.createdAt)}</div>
                </div>

                {isSender && <img src={avatarSender || IMGMiniZiro} alt="Saya" className={style.chatAvatar} />}
              </div>
            </React.Fragment>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      {canChat ? (
        <div className={style.inputArea}>
          <button className={style.btnAdd}>
            <img src={IconAdd} alt="Add" />
          </button>

          <input
            type="text"
            placeholder="Type your message..."
            className={style.inputField}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <button className={style.btnSend} onClick={handleSendMessage}>
            <img src={IconSend} alt="Send" />
          </button>
        </div>
      ) : (
        <div style={{ padding: "16px", textAlign: "center", backgroundColor: "#f5f5f5", color: "#888", fontSize: "14px" }}>
          Sesi aktivitas telah selesai. Chat tidak dapat dibalas.
        </div>
      )}
    </div>
  );
}