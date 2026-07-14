const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getRewardHistory,
} = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.get("/reward-history", protect, getRewardHistory);

module.exports = router;