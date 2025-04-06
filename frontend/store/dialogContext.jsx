import React, { createContext, useState } from "react";
import { Portal, Dialog, Button, Text } from "react-native-paper";

export const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: null, // callback
  });

  // showDialog takes in all objects within the option dict
  const showDialog = (options) => {
    setDialog({
      visible: true,
      title: options.title ?? "Confirm",
      message: options.message ?? "",
      confirmText: options.confirmText ?? "OK",
      cancelText: options.cancelText ?? "Cancel",
      onConfirm: options.onConfirm ?? null,
    });
  };

  // directly close the dialog
  const hideDialog = () => {
    setDialog((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // Hide the dialog, and call the onConfirm callback
  const handleConfirm = () => {
    // hide the dialog first
    hideDialog();
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {/* the dialog component */}
      <Portal>
        <Dialog visible={dialog.visible} onDismiss={hideDialog}>
          {dialog.title ? 
            <Dialog.Title>
              <Text variant="titleLarge">
                {dialog.title}
              </Text>
            </Dialog.Title> 
          : null}
          <Dialog.Content>
            <Text variant="titleMedium">
              {dialog.message}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>
              {dialog.cancelText}
            </Button>
            <Button onPress={handleConfirm}>
              {dialog.confirmText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </DialogContext.Provider>
  );
};
