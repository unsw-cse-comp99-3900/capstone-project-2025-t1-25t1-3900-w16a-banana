import { useContext } from "react";
import { AuthContext } from "../store/authContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
