import React from "react";
import { View, Text, Image, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import styles from "./ChatBubble.style";

export interface ChatBubbleProps {
  text: string;
  timestamp: string;
  isSender: boolean;
  avatarUrl?: string | null;
  avatarBorderColor?: string;
  bubbleColor?: string;
  textColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  bubbleStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  timeStyle?: StyleProp<TextStyle>;
}

export default function ChatBubble({ text, timestamp, isSender, avatarUrl, avatarBorderColor, bubbleColor, textColor, containerStyle, bubbleStyle, textStyle, timeStyle,
}: ChatBubbleProps) {
  const { theme } = useTheme();

  const resolvedBorderColor = avatarBorderColor || theme.colors.secondaryBackground || theme.colors.border;

  const defaultReceiverColor = theme.colors.tertiaryBackground || "#f3f4f6";
  const defaultSenderColor = theme.colors.primary || "#001846";
  const resolvedBubbleColor = bubbleColor || (isSender ? defaultSenderColor : defaultReceiverColor);

  const defaultSenderTextColor = "#ffffff";
  const defaultReceiverTextColor = theme.colors.textPrimary || "#0f172a";
  const resolvedTextColor = textColor || (isSender ? defaultSenderTextColor : defaultReceiverTextColor);

  const resolvedTimeColor = isSender
    ? "rgba(255, 255, 255, 0.7)"
    : theme.colors.textSecondary || "#475569";

  const receiverTimeMarginLeft = avatarUrl ? 44 : 0;

  return (
    <View
      style={[
        styles.container,
        isSender ? styles.senderContainer : styles.receiverContainer,
        containerStyle,
      ]}
    >
      {isSender ? (
        // Self
        <View style={{ alignItems: "flex-end", width: "100%" }}>
          <View
            style={[
              styles.bubble,
              styles.senderBubble,
              { backgroundColor: resolvedBubbleColor },
              bubbleStyle,
            ]}
          >
            <Text style={[styles.messageText, { color: resolvedTextColor }, textStyle]}>
              {text}
            </Text>
          </View>
          <Text
            style={[
              styles.timestamp,
              { color: resolvedTimeColor, marginRight: 4 },
              timeStyle,
            ]}
          >
            {timestamp}
          </Text>
        </View>
      ) : (
        // Other
        <View style={{ alignItems: "flex-start", width: "100%" }}>
          <View style={styles.avatarAndBubbleRow}>
            {avatarUrl ? (
              <View style={[styles.avatarContainer, { borderColor: resolvedBorderColor }]}>
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
            ) : null}
            <View
              style={[
                styles.bubble,
                styles.receiverBubble,
                { backgroundColor: resolvedBubbleColor },
                bubbleStyle,
              ]}
            >
              <Text style={[styles.messageText, { color: resolvedTextColor }, textStyle]}>
                {text}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.timestamp,
              { color: resolvedTimeColor, marginLeft: receiverTimeMarginLeft },
              timeStyle,
            ]}
          >
            {timestamp}
          </Text>
        </View>
      )}
    </View>
  );
}
