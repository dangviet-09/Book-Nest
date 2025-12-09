import { Router } from "express";
import {
  getAllShops,
  getShopById,
  followShop,
  unfollowShop,
  getFollowedShops,
  checkFollowStatus,
} from "../controllers/shop.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllShops);
router.get("/:id", getShopById);

// Protected routes (require authentication)
router.post("/:shopId/follow", protectRoute, followShop);
router.post("/:shopId/unfollow", protectRoute, unfollowShop);
router.get(
  "/:shopId/follow-status/:customerId",
  protectRoute,
  checkFollowStatus
);
router.get("/customer/:customerId/followed", protectRoute, getFollowedShops);

export default router;
