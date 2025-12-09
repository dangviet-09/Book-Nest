import { Router } from "express";
import {
  createNotificationController,
  getNotificationsByCustomerIdController,
  updateNotificationController,
  updateAllNotificationsController,
} from "../controllers/notification.controller.js";

const router = Router();

router.post("/", createNotificationController);
router.get("/:customerId", getNotificationsByCustomerIdController);
router.put("/:notificationId", updateNotificationController);
router.put("/:customerId/read-all", updateAllNotificationsController);

export default router;
