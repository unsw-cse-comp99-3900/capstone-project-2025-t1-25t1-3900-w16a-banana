import { useContext } from "react";
import { ToastContext } from "../store/toastContext";

/**
 * Custom React hook to access the Toast context.
 * 
 * Returns:
 * - The value stored in `ToastContext`, includes functions like `showToast`
 *   for displaying toast messages across the app.
 */
const useToast = () => {
  return useContext(ToastContext);
};

export default useToast;