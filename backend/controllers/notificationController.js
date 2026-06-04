import Notification from "../models/Notification.js";

// Get notifications
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// Mark single as read
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// Mark all as read
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};
