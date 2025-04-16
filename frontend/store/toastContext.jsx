import React, { createContext, useState, useRef } from "react";
import { Snackbar, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

export const ToastContext = createContext();

/**
 * ToastContext.jsx
 * 
 * Provides a global context for managing toast notifications across the app.
 * Allows any component to trigger a toast message with a specified content and type.
 * 
 * Context Values:
 * - isToastVisible: boolean - Controls the visibility of the toast.
 * - toastMessage: string - The message content shown in the toast.
 * - toastType: string - The toast variant (e.g., "success", "error", etc.).
 * - showToast: function(message: string, type: string) - Displays the toast with a message and type.
 * - hideToast: function() - Hides the currently visible toast.
 * 
 * Usage:
 * - Wrap your app in <ToastProvider> to enable access to the toast context.
 * - Use the `useToast()` hook to trigger or dismiss toast messages in any component.
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: "", status: "", action: null });
  const timeoutRef = useRef(null);

  // input the message, and the status == success, error
  const showToast = (message, status = "success", action = null, duration = 3000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ visible: true, message, status, action });

    timeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: "", status: "", action: null });
      timeoutRef.current = null;
    }, duration);
  };

  const hideToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast({ visible: false, message: "", status: "", action: null });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        visible={toast.visible}
        onDismiss={hideToast}
        action={toast.action}
        duration={3000}
        style={{ 
          backgroundColor: toast.status === "success" ? "#4CAF50" : "#D32F2F",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons 
            name={toast.status === "success" ? "check-circle" : "error"} 
            size={20} 
            color="white" 
            style={{ marginRight: 10 }} 
          />
          <Text style={{ color: "white" }}>{toast.message}</Text>
        </View>
      </Snackbar>
    </ToastContext.Provider>
  );
};
