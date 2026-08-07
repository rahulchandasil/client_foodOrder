import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const pushToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      user,
      setUser,
      toasts,
      removeToast,
      success: (message) => pushToast("success", message),
      error: (message) => pushToast("error", message),
    }),
    [theme, user, toasts]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
