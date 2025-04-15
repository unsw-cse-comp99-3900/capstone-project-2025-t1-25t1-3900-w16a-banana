import { router, useLocalSearchParams } from 'expo-router';
import { View, Linking, ScrollView } from 'react-native';
import { ActivityIndicator, IconButton, Text, TextInput } from 'react-native-paper';
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

  // user can add new message
  const [message, setMessage] = useState("");

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

  const submitChat = async () => {
    const newMessage = message.trim();
    if (!newMessage) {
      showToast("Please enter a message", "error");
      setMessage("");
      return;
    }

    // prepare to submit
    const url = `${BACKEND}/chat/send/${userType}/${userId}`;
    const config = { headers: { Authorization: contextProfile.token } };
    const data = { message: newMessage };

    try {
      await axios.post(url, data, config);
      setMessage("");
    } catch (error) {
      const msg = error.response?.data?.message || "Error sending message";
      console.error(error);
      showToast(msg, "error");
    }
  };

  // during loading, show the loading symbol
  if (!chatUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    )
  }

  return (
    <View 
      style={{ 
        flex: 1, 
        paddingTop: 14, 
        backgroundColor: "#f9f9f9",
        paddingBottom: 0,
      }}
    >
      {/* Header  */}
      <View 
        style={{ 
          paddingHorizontal: 16,
          flexDirection: "row", 
          justifyContent: "space-between",
          alignItems: "center", 
          marginBottom: 12,
        }}
      >
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text variant="titleMedium">{name}</Text>
          <Text variant="bodyMedium" style={{ color: "#999" }}>
            {capitalize(chatUser.role)}
          </Text>
        </View>
        <IconButton icon="phone" size={24}
          onPress={() => {
            const url = `tel:${chatUser.phone}`;
            Linking.openURL(url).catch((err) => {
              console.error("Error opening dialer:", err);
              showToast("Error opening dialer", "error");
            });
          }}
        />
      </View>

      {/* Chats inside the scroll view */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 12, paddingBottom: 80 }}
        style={{ flex: 1, paddingHorizontal: 16 }}
      >
        {chats.map((chat, index) => (
          <ChatPageOneChat
            key={chat.time}
            chat={chat}
            chatUser={chatUser}
          />
        ))}
        <View ref={bottomRef} />
      </ScrollView>

      {/* Fixed Input Field */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        backgroundColor: "#fff",
      }}>
        <TextInput
          underlineColor="transparent"
          dense
          mode="outlined"
          multiline
          numberOfLines={2}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          style={{
            flex: 1,
            borderRadius: 20,
            fontSize: 16,
            marginRight: 8,
          }}
        />
        <IconButton icon="send" size={24} onPress={submitChat} />
      </View>
    </View>
  );
}