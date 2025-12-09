import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  // State
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUploadingImage: false,
  isCheckingAuth: true,

  // Actions
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user, isCheckingAuth: false });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user, isSigningUp: false });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      set({ isSigningUp: false });
      throw error;
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user, isLoggingIn: false });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      set({ isLoggingIn: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  uploadImage: async (imageData) => {
    set({ isUploadingImage: true });
    try {
      const res = await axiosInstance.post("/auth/upload-image", {
        image: imageData,
      });
      set({ isUploadingImage: false });
      return res.data.imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);

      if (error.response?.status === 413) {
        toast.error(
          "Image is too large for upload. Please try a smaller image."
        );
      } else {
        toast.error(error.response?.data?.message || "Image upload failed");
      }

      set({ isUploadingImage: false });
      throw error;
    }
  },

  updateProfile: async (userId, data) => {
    set({ isUpdatingProfile: true });
    try {
      // Log payload size for debugging
      const payloadSize = JSON.stringify(data).length;
      console.log(
        `Sending payload of size: ${(payloadSize / 1024).toFixed(2)} KB`
      );

      const res = await axiosInstance.put(
        `/auth/update-profile/${userId}`,
        data
      );
      set({ authUser: res.data.user, isUpdatingProfile: false });
      toast.success("Profile updated successfully");
      return res.data.user;
    } catch (error) {
      console.error("Profile update error:", error);

      if (error.response?.status === 413) {
        toast.error(
          "Image is too large for upload. Please try a smaller image."
        );
      } else {
        toast.error(error.response?.data?.message || "Profile update failed");
      }

      set({ isUpdatingProfile: false });
      throw error;
    }
  },
}));

export default useAuthStore;
