import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  isLoadingNotifications: false,
  unreadCount: 0,

  // Actions
  getNotifications: async (customerId) => {
    set({ isLoadingNotifications: true });
    try {
      const res = await axiosInstance.get(`/notifications/${customerId}`);
      const notifications = res.data.notifications;
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.status).length,
        isLoadingNotifications: false,
      });
      return notifications;
    } catch (error) {
      console.error("Error getting notifications:", error);
      toast.error(
        error.response?.data?.message || "Failed to load notifications"
      );
      set({ isLoadingNotifications: false });
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}`);
      const { notifications } = get();
      const updatedNotifications = notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, status: true } : notif
      );
      set({
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.status).length,
      });
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
      throw error;
    }
  },

  markAllAsRead: async (customerId) => {
    try {
      await axiosInstance.put(`/notifications/${customerId}/read-all`);
      const { notifications } = get();
      const updatedNotifications = notifications.map((notif) => ({
        ...notif,
        status: true,
      }));
      set({
        notifications: updatedNotifications,
        unreadCount: 0,
      });
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
      throw error;
    }
  },
}));

export default useNotificationStore;
