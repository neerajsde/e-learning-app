"use client";
import apiHandler from "@/utils/apiHandler";
import { createContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const AppContext = createContext();

function AppContextProvider({ children }) {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const AuthUser = async () => {
    const resData = await apiHandler("/profile", "GET", true, null, {
      cache: "no-store",
    });
    // console.log(resData);
    if (resData.success) {
      setUserData(resData.data.userData);
      setIsLoggedIn(true);
    } else {
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          resData.message || "Failed to authenticate. Please try again.",
      });
    }
  };

  useEffect(() => {
    AuthUser();
  }, []);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    AuthUser,
    userData,
    setUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
