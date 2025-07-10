import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "../lib/api";

interface User {
  email: string;
  userName: string;
}

type LoginFn = (email: string, password: string) => Promise<void>;
type LogoutFn = () => void;

interface AuthCtx {
  user: User | null;
  login: LoginFn;
  logout: LogoutFn;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login: LoginFn = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.token);
    const { data: me } = await api.get("/user");
    setUser(me);
  };

  const logout: LogoutFn = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 