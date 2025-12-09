import { Router } from "express";
import {
  createBook,
  getBooksByShopId,
} from "../controllers/book.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/:shopId", protectRoute, createBook);
router.get("/:shopId", getBooksByShopId);

export default router;
