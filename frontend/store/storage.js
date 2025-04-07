import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// A wrapper for storage on both app and web platforms.
// On the web platform, use the sessionStorage by default, 
// so different web tabs will not conflict with each other. 
const WebsiteStorage = {
  async setItem(key, value) {
    if (Platform.OS === "web") {
      sessionStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  async getItem(key) {
    if (Platform.OS === "web") {
      return sessionStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  async removeItem(key) {
    if (Platform.OS === "web") {
      sessionStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

export default WebsiteStorage;