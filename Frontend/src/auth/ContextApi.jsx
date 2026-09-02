import { createContext, useEffect, useMemo, useState } from "react";
import { getMeApi, loginUser, logoutUser, updateProfileApi } from "./services/auth.api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("instagram_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem("instagram_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("instagram_user");
    }
  }, [user]);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const data = await getMeApi();
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, []);

  const login = async (formData) => {
    const data = await loginUser(formData);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const response = await updateProfileApi(payload);
    setUser(response.user);
    return response;
  };

  const value = useMemo(
    () => ({ user, setUser, login, logout, loading, updateProfile }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;