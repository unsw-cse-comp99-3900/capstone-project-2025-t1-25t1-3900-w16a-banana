import { useContext } from "react";
import { ToastContext } from "../store/toastContext";

const useToast = () => {
  return useContext(ToastContext);
};

export default useToast;