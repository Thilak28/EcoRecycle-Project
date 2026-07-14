const PickupRequest = require("../models/PickupRequest");
const User = require("../models/User");
const RewardHistory = require("../models/RewardHistory");
const asyncHandler = require("../utils/asyncHandler");
const { getRewardPoints } = require("../constants/rewardPoints");
const notify = require("../utils/notify");

const STATUS_FLOW = [
  "Assigned",
  "Accepted",
  "Out for Pickup",
  "Collected",
  "Delivered to Recycling Center",
  "Completed",
];

// @route  GET /api/agency/pickups
exports.getAssignedPickups = asyncHandler(async (req, res) => {
  const pickups = await PickupRequest.find({ assignedAgency: req.user._id })
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: pickups.length, pickups });
});

// @route  PUT /api/agency/pickups/:id/status
exports.updatePickupStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!STATUS_FLOW.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  const pickup = await PickupRequest.findById(req.params.id);

  if (!pickup) {
    return res.status(404).json({ success: false, message: "Pickup request not found" });
  }

  if (!pickup.assignedAgency || pickup.assignedAgency.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "This pickup is not assigned to your agency" });
  }

  const currentIndex = STATUS_FLOW.indexOf(pickup.status);
  const newIndex = STATUS_FLOW.indexOf(status);

  if (newIndex === -1 || newIndex < currentIndex) {
    return res.status(400).json({ success: false, message: "Cannot move status backwards or to an invalid stage" });
  }

  pickup.status = status;

  if (status === "Completed" && pickup.rewardPoints === 0) {
    const points = getRewardPoints(pickup.category);
    pickup.rewardPoints = points;

    await User.findByIdAndUpdate(pickup.user, { $inc: { rewardPoints: points } });

    await RewardHistory.create({
      user: pickup.user,
      pickup: pickup._id,
      earnedPoints: points,
      reason: `Completed pickup: ${pickup.itemName} (${pickup.category})`,
    });

    await notify(pickup.user, `You earned ${points} reward points for recycling your ${pickup.itemName}!`);
  }

  await pickup.save();

  await notify(pickup.user, `Your pickup request for "${pickup.itemName}" is now "${status}".`);

  res.status(200).json({ success: true, message: "Status updated", pickup });
});

// @route  GET /api/agency/history
exports.getAgencyHistory = asyncHandler(async (req, res) => {
  const pickups = await PickupRequest.find({
    assignedAgency: req.user._id,
    status: "Completed",
  })
    .populate("user", "name email")
    .sort({ updatedAt: -1 });

  res.status(200).json({ success: true, count: pickups.length, pickups });
});