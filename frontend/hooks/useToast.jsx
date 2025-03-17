import { useContext } from "react";
import { toastContext } from "../store/toastContext";

const useToast = () => {
  return useContext(toastContext);
};

export default useToast;