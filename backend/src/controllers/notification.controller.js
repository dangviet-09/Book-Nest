import {
  createNotification,
  getNotificationsByCustomerId,
  updateNotification,
  updateAllNotifications,
} from "../services/notification.service.js";

export const createNotificationController = async (req, res) => {
  const { customerId, message, type } = req.body;
  const notification = await createNotification(customerId, message, type);
  res.status(201).json({ notification });
};

export const getNotificationsByCustomerIdController = async (req, res) => {
  const { customerId } = req.params;
  const notifications = await getNotificationsByCustomerId(customerId);
  res.status(200).json({ notifications });
};

export const updateNotificationController = async (req, res) => {
  const { notificationId } = req.params;
  const notification = await updateNotification(notificationId);
  res.status(200).json({ notification });
};

export const updateAllNotificationsController = async (req, res) => {
  const { customerId } = req.params;
  const notifications = await updateAllNotifications(customerId);
  res.status(200).json({ notifications });
};
