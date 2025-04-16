import React, { createContext, useState, useEffect } from "react";
import WebsiteStorage from "./storage";

export const AuthContext = createContext();

/**
 * Provides authentication context for the application.
 *
 * Handles loading, storing, and clearing of the logged-in user profile
 * using local website storage. Automatically loads profile on mount.
 *
 * children - The React component(s) wrapped by the context provider.
 */
export const AuthProvider = ({ children }) => {
  const [contextProfile, setContextProfile] = useState(null);
  const [isContextLoading, setIsContextLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await WebsiteStorage.getItem("contextProfile");
        if (storedProfile) {
          setContextProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsContextLoading(false);
      }
    };
    loadProfile();
  }, []);

  const login = async (profile) => {
    try {
      await WebsiteStorage.setItem("contextProfile", JSON.stringify(profile));
      setContextProfile(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsContextLoading(false);
    }
  };

  const logout = async () => {
    try {
      await WebsiteStorage.removeItem("contextProfile");
      setContextProfile(null);
    } catch (error) {
      console.error("Error removing profile:", error);
    } finally {
      setIsContextLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ contextProfile, login, logout, isContextLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
