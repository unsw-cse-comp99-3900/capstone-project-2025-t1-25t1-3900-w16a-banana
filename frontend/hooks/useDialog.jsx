import { useContext } from "react";
import { DialogContext } from "../store/dialogContext";

/**
 * Custom React hook to access the Dialog context.
 * 
 * Returns:
 * - The value stored in `DialogContext`, includes functions like `showDialog` and `hideDialog`
 *   for displaying modal dialogs in the application.
 */
const useDialog = () => {
  return useContext(DialogContext);
};

export default useDialog;
