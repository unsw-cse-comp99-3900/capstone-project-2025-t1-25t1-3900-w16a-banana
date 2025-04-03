import { useContext } from "react";
import { DialogContext } from "../store/dialogContext";

const useDialog = () => {
  return useContext(DialogContext);
};

export default useDialog;
