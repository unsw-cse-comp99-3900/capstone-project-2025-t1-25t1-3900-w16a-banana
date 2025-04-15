import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';
import { BACKEND } from '../constants/backend';
import capitalize from 'capitalize';
import useAuth from '../hooks/useAuth';
import { router } from 'expo-router';

export default function ChatCard({ chat }) {
  const { contextProfile } = useAuth();

  // get the latest message from the chat, 
  // the message is ordered by time in ascending order
  const latestMessage = chat.chats[chat.chats.length - 1];
  
  // format the date time string, so if < 24 hours, show time ago, else show date
  const messageTime = new Date(latestMessage.time);
  const daysAgo = differenceInDays(new Date(), messageTime);
  
  const timeAgo = daysAgo >= 1
    ? format(messageTime, 'yyyy-MM-dd')
    : formatDistanceToNow(messageTime, { addSuffix: true });

  const nameAndRole = chat.user.role === 'customer' ? `Customer: ${chat.user.name}`
    : chat.user.role === 'driver' ? `Driver: ${chat.user.first_name} ${chat.user.last_name}`
    : `Restaurant: ${chat.user.name}`;
  
  // for different type, get the name
  const name = chat.user.role === 'customer' ? chat.user.username
    : chat.user.role === 'driver' ? `${chat.user.first_name} ${chat.user.last_name}`
    : chat.user.role === "restaurant" ? chat.user.name : "";
  
  // on press, go to this url
  const targetURL = `${contextProfile.role}/view/chat?userType=${chat.user.role}&userId=${chat.user.id}`;

  return (
    <Pressable style={{ width: "100%" }} onPress={() => router.push(targetURL)}>
      <View 
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 10,
          width: '100%',
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        {/* this will be 3 columns in the same row */}
        {/* column 1 is the avatar */}
        <Image
          source={{ uri: `${BACKEND}/${chat.user.url_profile_image}` }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#eee',
            marginRight: 12,
          }}
        />

        {/* column 2: Name + message */}
        <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Text variant="titleMedium">
            {capitalize.words(name)}
          </Text>
          <Text variant="bodyMedium" style={{ color: '#999' }}>
            {capitalize(chat.user.role)}
          </Text>
          <Text variant="bodyMedium" style={{ color: '#999' }} numberOfLines={1}>
            {latestMessage.message}
          </Text>
        </View>

        {/* Time ago */}
        <View style={{ marginLeft: 8, alignItems: 'flex-end' }}>
          <Text variant="bodySmall" style={{ color: '#999' }}>
            {capitalize(timeAgo)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
