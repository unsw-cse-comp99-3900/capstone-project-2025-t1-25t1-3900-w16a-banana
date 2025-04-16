import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";
import MyScrollView from "./MyScrollView";
import useAuth from "../hooks/useAuth";
import { BACKEND, TIME_INTERVAL } from "../constants/backend";
import axios from "axios";
import ChatCard from "./ChatCard";

/**
 * AllChatsPage component
 * 
 * Displays a list of all chat conversations for the logged-in user. 
 * Periodically fetches chat updates from the server and renders them 
 * as chat cards sorted by latest message time.
 * 
 * No props are required.
 */
export default function AllChatsPage() {
  const { contextProfile } = useAuth();
  const [chats, setChats] = useState([]);

  const fetchAllChats = async () => {
    if (!contextProfile) return;

    const url = `${BACKEND}/chat/get/all`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);
      const data = response.data;

      // sort the chats based on the last chat time, descending order
      const sorted = [...data].sort((a, b) => {
        const aTime = new Date(a.chats.at(-1)?.time || 0).getTime();
        const bTime = new Date(b.chats.at(-1)?.time || 0).getTime();
        return bTime - aTime;
      });

      setChats(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  // during mounting, start fetch, and set up the timer
  // during unmount, clear the timer
  useEffect(
    useCallback(() => {
      fetchAllChats(); 
      const interval = setInterval(fetchAllChats, TIME_INTERVAL);

      return () => clearInterval(interval); 
    }, [contextProfile])
  );

  return (
    <MyScrollView>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>
        All Chats
      </Text>

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
            gap: 12,
          }}
        >
          {chats.map((chat, index) => (
            <ChatCard key={index} chat={chat} />
          ))}
        </View>
      )}
    </MyScrollView>
  );
}
