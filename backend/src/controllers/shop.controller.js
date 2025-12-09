import * as shopService from "../services/shop.service.js";
import { getCustomer } from "../services/customer.service.js";

export const getAllShops = async (req, res) => {
  try {
    const shops = await shopService.getAllShops();
    res.status(200).json({ shops });
  } catch (error) {
    console.log("Error in getAllShops controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await shopService.getShopById(id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({ shop });
  } catch (error) {
    console.log("Error in getShopById controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const followShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const updatedCustomer = await shopService.followShop(customerId, shopId);
    const customer = await getCustomer(updatedCustomer.userId);

    res.status(200).json({
      message: "Shop followed successfully",
      customer,
    });
  } catch (error) {
    console.log("Error in followShop controller", error.message);

    if (
      error.message === "Already following this shop" ||
      error.message === "Customer not found"
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unfollowShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const updatedCustomer = await shopService.unfollowShop(customerId, shopId);
    const customer = await getCustomer(updatedCustomer.userId);

    res.status(200).json({
      message: "Shop unfollowed successfully",
      customer,
    });
  } catch (error) {
    console.log("Error in unfollowShop controller", error.message);

    if (
      error.message === "Not following this shop" ||
      error.message === "Customer not found"
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowedShops = async (req, res) => {
  try {
    const { customerId } = req.params;

    const followedShops = await shopService.getFollowedShops(customerId);

    res.status(200).json({ shops: followedShops });
  } catch (error) {
    console.log("Error in getFollowedShops controller", error.message);

    if (error.message === "Customer not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkFollowStatus = async (req, res) => {
  try {
    const { shopId, customerId } = req.params;

    const isFollowing = await shopService.isFollowingShop(customerId, shopId);

    res.status(200).json({ isFollowing });
  } catch (error) {
    console.log("Error in checkFollowStatus controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

