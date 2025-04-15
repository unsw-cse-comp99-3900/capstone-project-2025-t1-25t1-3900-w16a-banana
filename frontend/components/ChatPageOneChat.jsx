import React from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import { BACKEND } from "../constants/backend";
import { formatDistanceToNow, format, differenceInMinutes } from "date-fns";
import capitalize from "capitalize";

export default function ChatPageOneChat({ chatUser, chat }) {
  const { contextProfile } = useAuth();

  const avatar = chat.message_type === "sent"
    ? `${BACKEND}/${contextProfile.url_profile_image}`
    : `${BACKEND}/${chatUser.url_profile_image}`;
  
  // when the time ago is less than 1 hour, show the time ago,
  // otherwise, show YYYY-MM-DD HH:MM format
  const chatTime = new Date(chat.time);
  const minutesAgo = differenceInMinutes(new Date(), chatTime);

  const timeLabel = minutesAgo < 60
    ? capitalize(formatDistanceToNow(chatTime, { addSuffix: true }))
    : format(chatTime, "h:mmaaa, dd MMMM");

  return (
    <View 
      style={{ 
        marginBottom: 12, 
        flexDirection: chat.message_type === "sent" ? "row-reverse" : "row",
        alignItems: "flex-start",
        alignSelf: chat.message_type === "sent" ? "flex-end" : "flex-start",
        gap: 12,
      }}
    >
      {/* the avatar */}
      <Image
        source={{ uri: avatar }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          objectFit: "contain",
        }}
      />
      <View
        style={{
          flexDirection: "column",
          alignItems: chat.message_type === "sent" ? "flex-end" : "flex-start",
          gap: 6,
        }}
      >
        <View
          style={{
            backgroundColor: chat.message_type === "sent" ? "#6C63FF" : "#eee",
            borderRadius: 16,
            paddingVertical: 8,
            paddingHorizontal: 14,
            maxWidth: 300,       // 👈 updated
            minWidth: 60,
            flexShrink: 1,       // 👈 new
            flexWrap: "wrap",    // 👈 new
          }}
        >
          <Text 
            variant="bodyLarge"
            style={{ 
              color: chat.message_type === "sent" ? "#fff" : "#000",
            }}
          >
            {chat.message}
          </Text>
        </View>
        {/* how many time ago */}
        <Text
          variant="bodySmall"
          style={{ color: "#999" }}
        >
          {timeLabel}
        </Text>
      </View>
    </View>
  );
}
