import React, { createContext, useState } from "react";
import { Portal, Dialog, Button, Text } from "react-native-paper";

export const DialogContext = createContext();

/**
 * DialogContext provides a global confirmation dialog system.
 * 
 * Includes a `DialogProvider` component that renders a customizable dialog and
 * exposes `showDialog` and `hideDialog` methods via context.
 * 
 * showDialog(options):
 *   - title: string – The dialog title.
 *   - message: string – The main message of the dialog.
 *   - confirmText: string – Text on the confirm button (default: "OK").
 *   - cancelText: string – Text on the cancel button (default: "Cancel").
 *   - onConfirm: function – Callback to invoke when the confirm button is clicked.
 * 
 * hideDialog(): Hides the dialog.
 */
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
