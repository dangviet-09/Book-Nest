import React, { useEffect } from "react";
import { Bell, Check, AlertCircle, Info, CheckCircle } from "lucide-react";
import useNotificationStore from "../hooks/useNotificationStore";
import useAuthStore from "../hooks/useAuthStore";
import { formatDistanceToNow } from "date-fns";

const NotificationPage = () => {
  const { authUser } = useAuthStore();
  const {
    notifications,
    isLoadingNotifications,
    unreadCount,
    getNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const customerId = authUser?.id;

  useEffect(() => {
    if (customerId) {
      getNotifications(customerId);
    }
  }, [customerId, getNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(customerId);
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-error" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  if (isLoadingNotifications) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary text-primary-content mb-4">
              <Bell className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">
              Notifications
            </h1>
            <p className="text-base-content/70 mt-2">
              Stay updated with your latest activities
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </span>
              {unreadCount > 0 && (
                <span className="badge badge-primary">{unreadCount}</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="btn btn-outline btn-sm"
              >
                <Check className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center py-12">
                  <Bell className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No notifications
                  </h3>
                  <p className="text-base-content/70">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`card bg-base-100 shadow-xl ${
                    !notification.status ? "border-l-4 border-primary" : ""
                  }`}
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!notification.status && (
                              <span className="badge badge-primary badge-xs">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-base-content/70 mb-2">
                            {notification.content}
                          </p>
                          <span className="text-sm text-base-content/50">
                            {formatDistanceToNow(
                              new Date(notification.timestamp),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.status && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="btn btn-ghost btn-sm"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-base-content/50">
                Notifications are automatically deleted after 30 days
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
 