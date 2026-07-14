const PickupRequest = require("../models/PickupRequest");
const asyncHandler = require("../utils/asyncHandler");

// @route  POST /api/pickups
// @access Private (user only)
exports.createPickup = asyncHandler(async (req, res) => {
  const { category, itemName, quantity, condition, description, pickupAddress, preferredPickupDate } = req.body;

  if (!category || !itemName || !quantity || !condition || !pickupAddress || !preferredPickupDate) {
    return res.status(400).json({ success: false, message: "All required fields must be filled" });
  }

  const pickup = await PickupRequest.create({
    user: req.user._id,
    category,
    itemName,
    quantity,
    condition,
    description,
    pickupAddress,
    preferredPickupDate,
    image: req.file ? `/uploads/${req.file.filename}` : "",
  });

  res.status(201).json({ success: true, message: "Pickup request created", pickup });
});

// @route  GET /api/pickups/my
// @access Private (user only)
exports.getMyPickups = asyncHandler(async (req, res) => {
  const pickups = await PickupRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: pickups.length, pickups });
});

// @route  GET /api/pickups/:id
// @access Private (owner only)
exports.getPickupById = asyncHandler(async (req, res) => {
  const pickup = await PickupRequest.findById(req.params.id).populate("assignedAgency", "agencyName phone");

  if (!pickup) {
    return res.status(404).json({ success: false, message: "Pickup request not found" });
  }

  if (pickup.user.toString() !== req.user._id.toString() && req.user.role === "user") {
    return res.status(403).json({ success: false, message: "Not authorized to view this pickup" });
  }

  res.status(200).json({ success: true, pickup });
});