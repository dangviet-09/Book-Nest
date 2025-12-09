import Notification from "../models/notification.model.js";

export const createNotification = async ({ customerId, content }) => {
  const notification = await Notification.create({
    data: {
      customer: {
        connect: { id: customerId },
      },
      content: content,
      status: false,
    },
  });
  return notification;
};

export const getNotificationsByCustomerId = async (customerId) => {
  const notifications = await Notification.findMany({
    where: {
      customerId,
    },
  });
  return notifications;
};

export const updateNotification = async (notificationId) => {
  const notification = await Notification.update({
    where: {
      id: notificationId,
    },
    data: {
      status: true,
    },
  });
  return notification;
};
export const updateAllNotifications = async (customerId) => {
  const notifications = await Notification.updateMany({
    where: {
      customerId,
    },
    data: {
      status: true,
    },
  });
  return notifications;
};
