import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import ReduxLoginDemo from "./components/auth/ReduxLoginDemo";
import ReduxUserListDemo from "./components/auth/ReduxUserListDemo";
import SignupForm from "./components/auth/SignupForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import UserList from "./components/UserList";
import RoleManagement from "./components/RoleManagement";
import Permissions from "./components/Permissions";
import AdminRoute from "./components/shared/AdminRoute";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import HeaderAuth from "./components/HeaderAuth";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import Toast from "./components/shared/Toast";
import HomePage from "./components/profile/HomePage"; // ✅ Thêm dòng này

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <HeaderAuth />
          <Routes>
            <Route path="/redux-demo/login" element={<ReduxLoginDemo />} />
            <Route path="/redux-demo/users" element={<ReduxUserListDemo />} />
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
              path="/role-management"
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
                  <Permissions />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toast />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
