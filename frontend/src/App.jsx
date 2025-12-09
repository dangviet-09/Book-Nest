import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationPage from "./pages/NotificationPage";
import ShopPage from "./pages/ShopPage";
import ShopsPage from "./pages/ShopsPage";
import FollowedShopsPage from "./pages/FollowedShopsPage";
import useAuthStore from "./hooks/useAuthStore";
import { useThemeStore } from "./hooks/useThemeStore";

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route
          path="/followed-shops"
          element={
            authUser?.user?.role === "Customer" ? (
              <FollowedShopsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" replace /> : <SignUpPage />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/settings"
          element={
            authUser ? <SettingsPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profile"
          element={
            authUser ? <ProfilePage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/notifications"
          element={
            authUser ? <NotificationPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/shop"
          element={authUser ? <ShopPage /> : <Navigate to="/login" replace />}
        />
      </Routes>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--fallback-b1,oklch(var(--b1)))",
            color: "var(--fallback-bc,oklch(var(--bc)))",
          },
        }}
      />
    </div>
  );
};

export default App;
