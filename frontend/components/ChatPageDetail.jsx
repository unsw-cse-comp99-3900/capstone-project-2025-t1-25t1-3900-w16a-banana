import { router, useLocalSearchParams } from 'expo-router';
import { View, Linking, ScrollView } from 'react-native';
import MyScrollView from './MyScrollView';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import useAuth from '../hooks/useAuth';
import { BACKEND } from '../constants/backend';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import useToast from '../hooks/useToast';
import capitalize from 'capitalize';
import ChatPageOneChat from './ChatPageOneChat';

export default function ChatPageDetail() {
  const { userType, userId } = useLocalSearchParams();
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [chatUser, setChatUser] = useState(null);
  const [chats, setChats] = useState([]);

  // get the name of that user
  const name = !chatUser ? null  
    : chatUser?.role === "customer" ? chatUser.name
    : chatUser?.role === "driver" ? `${chatUser.first_name} ${chatUser.last_name}`
    : chatUser?.name;

  // get all the chats between them
  const fetchChat = async () => {
    if (!contextProfile) return;
    const url = `${BACKEND}/chat/get/${userType}/${userId}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);
      const data = response.data;
      console.log(data);

      setChatUser(data.user);
      setChats(data.chats);
    } catch (error) {
      const msg = error.response?.data?.message || "Error fetching chat data";
      console.error(error);
      showToast(msg, "error");
      router.back();
    }
  };

  useEffect(() => {
    fetchChat();
  }, [userType, userId, contextProfile]);

  // add the scroll view ref
  const scrollViewRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    // slight delay ensures layout is stable before scrolling
    setTimeout(() => {
      bottomRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true });
        },
        (error) => console.error('Scroll error', error)
      );
    }, 100);
  }, [chats]);

  // during loading, show the loading symbol
  if (!chatUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    )
  }

  return (
    <MyScrollView>
      {/* on the top of the page, a back button, the profile, and right the phone call */}
      <View 
        style={{ 
          flexDirection: "row", 
          justifyContent: "space-between",
          alignItems: "center", 
          marginBottom: 12,
          width: "100%"
        }}
      >
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 0 }}>
          <Text variant="titleMedium">
            {name}
          </Text>
          <Text variant="bodyMedium" style={{ color: "#999" }}>
            {capitalize(chatUser.role)}
          </Text>
        </View>
        <IconButton icon="phone" size={24}
          onPress={() => {
            // open the phone call app
            const url = `tel:${chatUser.phone}`;
            Linking.openURL(url).catch((err) => {
              console.error("Error opening dialer:", err);
              showToast("Error opening dialer", "error");
            });
          }}
        />
      </View>
      {/* here is a scroll view, and display all the chats */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 32 }}
      >
        {chats.map((chat, index) => (
          <ChatPageOneChat
            key={chat.time}
            chat={chat}
            chatUser={chatUser}
          />
        ))}
        {/* 👇 this is the bottom anchor for auto-scroll */}
        <View ref={bottomRef} />
      </ScrollView>
    </MyScrollView>
  );
}