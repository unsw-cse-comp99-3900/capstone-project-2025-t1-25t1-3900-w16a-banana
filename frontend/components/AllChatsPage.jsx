import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import MyScrollView from './MyScrollView';
import useAuth from '../hooks/useAuth';
import { BACKEND } from '../constants/backend';
import axios from 'axios';
import ChatCard from './ChatCard';

export default function AllChatsPage() {
  const { contextProfile } = useAuth();

  // save all chats
  const [chats, setChats] = useState([]);


  const fetchAllChats = async () => {
    const url = `${BACKEND}/chat/get/all`;
    const config = { headers: { Authorization: contextProfile.token } };
    
    try {
      const response = await axios.get(url, config);
      const data = response.data;
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!contextProfile) return;
    fetchAllChats();
  }, [contextProfile]);

  


  return (
    <MyScrollView>
      <Text variant="titleLarge"
        style={{
          marginBottom: 12,
        }}
      >
        All Chats
      </Text>
      {/* display all the chats */}
      {chats.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Icon source="chat-sleep" size={60} color="#ccc" />
          <Text variant="titleMedium" style={{ marginTop: 12, color: "#999" }}>
            No chats yet.
          </Text>
        </View>
      ) : (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 5,
          }}
        >
          {chats.map((chat, index) => (
            <ChatCard
              key={index}
              chat={chat}
            />
          ))}
        </View>
      )}
    </MyScrollView>
  )
}
