/**
 * Constants for backend API URL and timing settings.
 *
 * BACKEND: string - Base URL of the backend server depending on platform (Android emulator uses 10.0.2.2).
 * TIME_INTERVAL: number - Default polling interval in milliseconds (10 seconds).
 */
import { Platform } from "react-native";

export const BACKEND = Platform.OS === "android"
  ? "http://10.0.2.2:11000"
  : "http://localhost:11000";

// refresh with the backend every second
export const TIME_INTERVAL = 10000;
