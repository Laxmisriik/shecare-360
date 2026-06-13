import { createContext, useContext, useState, ReactNode } from "react";
import {
  API_BASE,
  setAuth,
  clearAuth,
  getToken,
  getStoredUser,
  type StoredUser,
} from "@/lib/api";

interface AuthContextType {
  isLoggedIn: boolean;
  user: StoredUser | null;
  userId: number | null;
  token: string | null;
  /** Authenticate against Flask /login. Throws on failure with a message. */
  login: (username: string, password: string) => Promise<void>;
  /** Register against Flask /register. Throws on failure with a message. */
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Hydrate from localStorage so a refresh keeps the session.
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Invalid username or password");
    }

    const storedUser: StoredUser = { userId: data.user_id, username: data.username };
    setAuth(data.access_token, storedUser);
    setToken(data.access_token);
    setUser(storedUser);
  };

  const register = async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        user,
        userId: user?.userId ?? null,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
