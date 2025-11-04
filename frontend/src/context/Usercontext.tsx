"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
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

        console.log(data);

        if (res.ok) {
          const userData = data?.data?.user || data?.user;

          // ✅ Fallback avatar logic
          const finalUser = userData
            ? {
                ...userData,
                avatar:
                  userData.avatar && userData.avatar.trim() !== ""
                    ? userData.avatar
                    : "/avatarLocal.jpg", // Path inside /public
              }
            : null;

          console.log("User fetched:", finalUser);
          setUser(finalUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
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
