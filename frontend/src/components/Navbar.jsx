import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, User, BookOpen, Settings, Bell, Store } from "lucide-react";
import useAuthStore from "../hooks/useAuthStore";
import useNotificationStore from "../hooks/useNotificationStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { unreadCount, getNotifications } = useNotificationStore();

  useEffect(() => {
    if (authUser?.user?.role === "Customer") {
      getNotifications(authUser.id);
    }
  }, [authUser, getNotifications]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          <BookOpen className="h-6 w-6" />
          BookNest
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="btn btn-ghost">
              Home
            </Link>
          </li>
          <li>
            <Link to="/shops" className="btn btn-ghost">
              <Store className="h-4 w-4" />
              Shops
            </Link>
          </li>
          {authUser?.user?.role === "Customer" && (
            <>
              <li>
                <Link to="/followed-shops" className="btn btn-ghost">
                  <BookOpen className="h-4 w-4" />
                  My Books
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="btn btn-ghost relative">
                  <Bell className="h-4 w-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="badge badge-primary badge-xs absolute -top-1 -right-1">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            </>
          )}
          {authUser?.user?.role === "Seller" && (
            <li>
              <Link to="/shop" className="btn btn-ghost">
                <Store className="h-4 w-4" />
                My Shop
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {authUser ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {authUser.user.imageUrl ? (
                  <img
                    src={authUser.user.imageUrl}
                    alt={authUser.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li className="menu-title">
                <span>{authUser.name}</span>
                <span className="text-xs opacity-60">{authUser.email}</span>
                <span className="badge badge-primary badge-sm">
                  {authUser.user.role}
                </span>
              </li>
              <li>
                <Link to="/profile">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </li>
              {authUser.user.role === "Customer" && (
                <>
                  <li>
                    <Link to="/followed-shops">
                      <BookOpen className="h-4 w-4" />
                      My Books
                    </Link>
                  </li>
                  <li>
                    <Link to="/notifications" className="relative">
                      <Bell className="h-4 w-4" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="badge badge-primary badge-xs absolute -top-1 -right-1">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </>
              )}
              {authUser.user.role === "Seller" && (
                <li>
                  <Link to="/shop">
                    <Store className="h-4 w-4" />
                    My Shop
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="text-error">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
