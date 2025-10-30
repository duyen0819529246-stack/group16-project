import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import UserList from "./components/UserList";
import AdminRoute from "./components/shared/AdminRoute";
import HeaderAuth from "./components/HeaderAuth";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import Toast from "./components/shared/Toast";
import HomePage from "./components/profile/HomePage";
feature/log-rate-limit
import AdminActivityLogs from "./components/admin/AdminActivityLogs";

import RoleManagement from "./components/admin/RoleManagement";
import UserPermissions from "./components/profile/UserPermissions";
main

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <HeaderAuth />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <UserList />
                </AdminRoute>
              }
            />
            <Route
feature/log-rate-limit
              path="/admin/activity-logs"
              element={
                <AdminRoute>
                  <AdminActivityLogs />
                </AdminRoute>
              }
            />

              path="/admin/roles"
              element={
                <AdminRoute>
                  <RoleManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/permissions"
              element={
                <ProtectedRoute>
                  <UserPermissions />
                </ProtectedRoute>
              }
            />
 main
          </Routes>
          <Toast />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
