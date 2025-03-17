import React, { createContext, useContext, useState, useRef } from "react";
import { Snackbar } from "react-native-paper";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: "", action: null });
  const timeoutRef = useRef(null);

  // timeout auto at 3 seconds
  const showToast = (message, action = null, duration = 3000) => {
    // clear timeout and prevent flickering
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ visible: true, message, action });

    timeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: "", action: null });
      timeoutRef.current = null;
    }, duration);
  };

  const hideToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast({ visible: false, message: "", action: null });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        visible={toast.visible}
        onDismiss={hideToast}
        action={toast.action}
        duration={3000}
        style={{ backgroundColor: "#333" }} // Custom styling
      >
        {toast.message}
      </Snackbar>
    </ToastContext.Provider>
  );
};