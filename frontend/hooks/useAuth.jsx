import { useContext } from "react";
import { AuthContext } from "../store/authContext";

/**
 * Custom React hook that provides access to the authentication context.
 * 
 * Returns:
 * - The value stored in `AuthContext`, which includes the current user's profile and authentication token,
 * and functions for logging in and out.
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
