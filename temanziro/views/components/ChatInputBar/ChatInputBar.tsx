import React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import styles from './ChatInputBar.style'
import SendIcon from "@/assets/icon/send.svg";
import AddIcon from "@/assets/icon/add.svg";

interface ChatInputBarProps {
    onSend?: (text: string) => void;
}

export default function ChatInputBar({ onSend }: ChatInputBarProps) {
    const [newMessage, setNewMessage] = React.useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        if (onSend) {
            onSend(newMessage.trim());
        }
        setNewMessage('');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonAdd} activeOpacity={0.7}>
                <AddIcon width={15} height={15} />
            </TouchableOpacity>

            <TextInput
                style={styles.inputField}
                placeholder="Ketik pesan Anda..."
                placeholderTextColor="#94A3B8"
                value={newMessage}
                onChangeText={setNewMessage}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                multiline={true}
            />

            <TouchableOpacity
                style={[styles.buttonSend, !newMessage.trim() && styles.buttonSendDisabled]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
                activeOpacity={0.8}
            >
                <SendIcon width={16} height={16} />
            </TouchableOpacity>
        </View>
    )
}