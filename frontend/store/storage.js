import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * WebsiteStorage - A unified storage utility for React Native and Web platforms.
 * 
 * Provides consistent `setItem`, `getItem`, and `removeItem` methods using:
 * - `AsyncStorage` for native platforms (iOS, Android)
 * - `sessionStorage` for web (to avoid conflicts between browser tabs)
 * 
 * Methods:
 * - setItem(key, value): Store a value under a key.
 * - getItem(key): Retrieve a value for the given key.
 * - removeItem(key): Delete a key-value pair from storage.
 */
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