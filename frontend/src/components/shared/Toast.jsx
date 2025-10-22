import React from "react";
import { useToast } from "../../contexts/ToastContext";

export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;
  const bg = toast.type === "error" ? "#e74c3c" : toast.type === "success" ? "#2ecc71" : "#3498db";
  const style = { position: "fixed", right: 20, bottom: 20, padding: 12, background: bg, color: "#fff", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.12)" };
  return <div style={style}>{toast.message}</div>;
}