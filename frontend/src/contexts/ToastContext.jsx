// src/contexts/ToastContext.jsx
import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const show = (message, type = "info", timeout = 4000) => {
    setToast({ message, type });
    if (timeout) setTimeout(() => setToast(null), timeout);
  };
  const hide = () => setToast(null);
  return <ToastContext.Provider value={{ toast, show, hide }}>{children}</ToastContext.Provider>;
};

export const useToast = () => useContext(ToastContext);
