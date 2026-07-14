const Notification = require("../models/Notification");
const RewardHistory = require("../models/RewardHistory");
const asyncHandler = require("../utils/asyncHandler");

exports.getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  res.status(200).json({ success: true, unreadCount, notifications });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });

  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ success: true, message: "Marked as read" });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ success: true, message: "All notifications marked as read" });
});

exports.getRewardHistory = asyncHandler(async (req, res) => {
  const history = await RewardHistory.find({ user: req.user._id })
    .populate("pickup", "itemName category")
    .sort({ createdAt: -1 });

  const totalEarned = history.reduce((sum, h) => sum + h.earnedPoints, 0);

  res.status(200).json({ success: true, totalEarned, history });
});
