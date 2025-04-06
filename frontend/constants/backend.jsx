import { Platform } from "react-native";

export const BACKEND = Platform.OS === "android"
  ? "http://10.0.2.2:11000"
  : "http://localhost:11000";
