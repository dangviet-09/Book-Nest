import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const useShopStore = create((set, get) => ({
  // State
  shops: [],
  followedShops: [],
  selectedShop: null,
  isLoadingShops: false,
  isFollowingShop: false,
  isUnfollowingShop: false,
  isLoadingFollowedShops: false,

  // Actions
  getAllShops: async () => {
    set({ isLoadingShops: true });
    try {
      const res = await axiosInstance.get("/shops");
      set({ shops: res.data.shops, isLoadingShops: false });
    } catch (error) {
      console.error("Error getting shops:", error);
      toast.error(error.response?.data?.message || "Failed to load shops");
      set({ isLoadingShops: false });
    }
  },

  getShopById: async (shopId) => {
    try {
      const res = await axiosInstance.get(`/shops/${shopId}`);
      set({ selectedShop: res.data.shop });
      return res.data.shop;
    } catch (error) {
      console.error("Error getting shop:", error);
      toast.error(error.response?.data?.message || "Failed to load shop");
      throw error;
    }
  },

  followShop: async (shopId, customerId) => {
    set({ isFollowingShop: true });
    try {
      const res = await axiosInstance.post(`/shops/${shopId}/follow`, {
        customerId,
      });

      // Update the shops list to reflect the follow status
      const { shops } = get();
      const updatedShops = shops.map((shop) => {
        if (shop.id === shopId) {
          return {
            ...shop,
            observers: [...shop.observers, res.data.customer],
            _count: {
              ...shop._count,
              observers: shop._count.observers + 1,
            },
          };
        }
        return shop;
      });

      set({
        shops: updatedShops,
        isFollowingShop: false,
      });

      toast.success("Shop followed successfully!");
      return res.data.customer;
    } catch (error) {
      console.error("Error following shop:", error);
      toast.error(error.response?.data?.message || "Failed to follow shop");
      set({ isFollowingShop: false });
      throw error;
    }
  },

  unfollowShop: async (shopId, customerId) => {
    set({ isUnfollowingShop: true });
    try {
      const res = await axiosInstance.post(`/shops/${shopId}/unfollow`, {
        customerId,
      });

      // Update the shops list to reflect the unfollow status
      const { shops } = get();
      const updatedShops = shops.map((shop) => {
        if (shop.id === shopId) {
          return {
            ...shop,
            observers: shop.observers.filter(
              (observer) => observer.id !== customerId
            ),
            _count: {
              ...shop._count,
              observers: shop._count.observers - 1,
            },
          };
        }
        return shop;
      });

      set({
        shops: updatedShops,
        isUnfollowingShop: false,
      });

      toast.success("Shop unfollowed successfully!");
      return res.data.customer;
    } catch (error) {
      console.error("Error unfollowing shop:", error);
      toast.error(error.response?.data?.message || "Failed to unfollow shop");
      set({ isUnfollowingShop: false });
      throw error;
    }
  },

  getFollowedShops: async (customerId) => {
    set({ isLoadingFollowedShops: true });
    try {
      const res = await axiosInstance.get(
        `/shops/customer/${customerId}/followed`
      );
      set({ followedShops: res.data.shops, isLoadingFollowedShops: false });
      return res.data.shops;
    } catch (error) {
      console.error("Error getting followed shops:", error);
      toast.error(
        error.response?.data?.message || "Failed to load followed shops"
      );
      set({ isLoadingFollowedShops: false });
      throw error;
    }
  },

  checkFollowStatus: async (shopId, customerId) => {
    try {
      const res = await axiosInstance.get(
        `/shops/${shopId}/follow-status/${customerId}`
      );
      return res.data.isFollowing;
    } catch (error) {
      console.error("Error checking follow status:", error);
      return false;
    }
  },

  // Utility function to check if current user is following a shop
  checkIsFollowingShop: (shopId, customerId) => {
    const { shops } = get();
    const shop = shops.find((s) => s.id === shopId);
    if (!shop) return false;

    return shop.observers.some((observer) => observer.id === customerId);
  },
}));

export default useShopStore;
