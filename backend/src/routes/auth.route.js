import { Router } from "express";
import {
  signUp,
  login,
  logout,
  checkAuth,
  updateProfile,
  uploadImage,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);
router.put("/update-profile/:id", protectRoute, updateProfile);
router.post("/upload-image", protectRoute, uploadImage);

export default router;
