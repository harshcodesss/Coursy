"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Course {
  _id: string;
  title: string;
}

interface User {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
  courses?: Course[];
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/me`,
          {
            credentials: "include",
          }
        );
        
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401 || data.message === "jwt expired") {
            localStorage.removeItem("token");
            setUser(null);
            window.location.href = "/login";
            return;
          }
          setUser(null);
          return;
        }

        const userData = data?.data?.user || data?.user;

        const finalUser = userData
          ? {
              ...userData,
              avatar:
                userData.avatar && userData.avatar.trim() !== ""
                  ? userData.avatar
                  : "/avatarLocal.jpg",
            }
          : null;

        setUser(finalUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);