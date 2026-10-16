import { createContext, useContext, useState } from "react";
import api from "../api/client.js";

// Logged-in user ki info poori app mein share karne ke liye Context
const AuthContext = createContext(null);

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("mm_user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);

  // Login/signup ke baad token aur user ko save karo
  function saveSession({ token, user }) {
    localStorage.setItem("mm_token", token);
    localStorage.setItem("mm_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data);
  }

  async function signup(name, email, password) {
    const { data } = await api.post("/auth/signup", { name, email, password });
    saveSession(data);
  }

  function logout() {
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Kisi bhi component mein: const { user, logout } = useAuth();
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
