import React from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";


export default function MyScrollView({ children }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={true}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}