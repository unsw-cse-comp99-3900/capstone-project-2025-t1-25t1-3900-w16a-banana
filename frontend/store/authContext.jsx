import React, { createContext, useState, useEffect } from "react";
import Storage from "./storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [contextProfile, setContextProfile] = useState(null);
  const [isContextLoading, setIsContextLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await Storage.getItem("contextProfile");
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
      await Storage.setItem("contextProfile", JSON.stringify(profile));
      setContextProfile(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsContextLoading(false);
    }
  };

  const logout = async () => {
    try {
      await Storage.removeItem("contextProfile");
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
