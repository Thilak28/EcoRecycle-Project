const User = require("../models/User");
const PickupRequest = require("../models/PickupRequest");
const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const notify = require("../utils/notify");

// @route  GET /api/admin/dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalAgencies, statusCounts, rewardAgg, categoryAgg] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "agency" }),
    PickupRequest.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    PickupRequest.aggregate([{ $group: { _id: null, totalPoints: { $sum: "$rewardPoints" } } }]),
    PickupRequest.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
  ]);

  const statusMap = {};
  statusCounts.forEach((s) => { statusMap[s._id] = s.count; });

  const categoryMap = {};
  categoryAgg.forEach((c) => { categoryMap[c._id] = c.count; });

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalAgencies,
      pending: statusMap["Pending"] || 0,
      assigned: statusMap["Assigned"] || 0,
      accepted: statusMap["Accepted"] || 0,
      completed: statusMap["Completed"] || 0,
      cancelled: statusMap["Cancelled"] || 0,
      totalRewardPointsDistributed: rewardAgg[0]?.totalPoints || 0,
      categoryWiseCollection: categoryMap,
    },
  });
});

// @route  GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// @route  PUT /api/admin/users/:id/block
exports.toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  if (user.role === "admin") {
    return res.status(403).json({ success: false, message: "Cannot block an admin account" });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isBlocked ? "blocked" : "activated"}`,
    isBlocked: user.isBlocked,
  });
});

// @route  GET /api/admin/agencies
exports.getAllAgencies = asyncHandler(async (req, res) => {
  const agencies = await User.find({ role: "agency" }).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: agencies.length, agencies });
});

// @route  POST /api/admin/agencies
exports.createAgency = asyncHandler(async (req, res) => {
  const { name, email, password, phone, agencyName, serviceArea, workersCount } = req.body;

  if (!name || !email || !password || !phone || !agencyName) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const agency = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "agency",
    agencyName,
    serviceArea: serviceArea || "",
    workersCount: workersCount || 0,
  });

  res.status(201).json({
    success: true,
    message: "Agency account created",
    agency: {
      id: agency._id,
      name: agency.name,
      email: agency.email,
      agencyName: agency.agencyName,
      serviceArea: agency.serviceArea,
    },
  });
});

// @route  GET /api/admin/pickups
exports.getAllPickups = asyncHandler(async (req, res) => {
  const pickups = await PickupRequest.find()
    .populate("user", "name email phone")
    .populate("assignedAgency", "agencyName")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: pickups.length, pickups });
});

// @route  PUT /api/admin/assign-agency/:pickupId
exports.assignAgency = asyncHandler(async (req, res) => {
  const { agencyId } = req.body;

  const agency = await User.findOne({ _id: agencyId, role: "agency" });
  if (!agency) {
    return res.status(404).json({ success: false, message: "Agency not found" });
  }

  const pickup = await PickupRequest.findById(req.params.pickupId);
  if (!pickup) {
    return res.status(404).json({ success: false, message: "Pickup request not found" });
  }

  pickup.assignedAgency = agency._id;
  pickup.status = "Assigned";
  await pickup.save();

  // Notify both the user and the agency
  await notify(pickup.user, `Your pickup request for "${pickup.itemName}" has been assigned to ${agency.agencyName}.`);
  await notify(agency._id, `A new pickup request for "${pickup.itemName}" has been assigned to your agency.`);

  res.status(200).json({ success: true, message: "Agency assigned successfully", pickup });
});

// @route  GET /api/admin/reports
exports.getReports = asyncHandler(async (req, res) => {
  const monthlyTrend = await PickupRequest.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const topAgencies = await PickupRequest.aggregate([
    { $match: { status: "Completed", assignedAgency: { $ne: null } } },
    { $group: { _id: "$assignedAgency", completedCount: { $sum: 1 } } },
    { $sort: { completedCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "agency",
      },
    },
    { $unwind: "$agency" },
    { $project: { agencyName: "$agency.agencyName", completedCount: 1 } },
  ]);

  res.status(200).json({ success: true, monthlyTrend, topAgencies });
});