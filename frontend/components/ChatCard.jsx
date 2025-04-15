import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { formatDistanceToNow } from 'date-fns';
import { BACKEND } from '../constants/backend';

export default function ChatCard({ chat }) {
  const latestMessage = chat.chats[chat.chats.length - 1];
  const timeAgo = formatDistanceToNow(new Date(latestMessage.time), { addSuffix: true });

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 10,
      width: '100%',
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
      elevation: 1,
    }}>
      {/* Avatar */}
      <Image
        source={{ uri: `${BACKEND}/${chat.user.url_profile_image}` }}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          marginRight: 12,
          backgroundColor: '#eee',
        }}
      />

      {/* Name + message */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text variant="titleMedium">
          {chat.user.name} ({chat.user.role})
        </Text>
        <Text variant="bodyMedium" numberOfLines={1}>
          {latestMessage.message}
        </Text>
      </View>

      {/* Time ago */}
      <View style={{ marginLeft: 8, alignItems: 'flex-end' }}>
        <Text variant="bodySmall" style={{ color: '#999' }}>
          {timeAgo}
        </Text>
      </View>
    </View>
  );
}
