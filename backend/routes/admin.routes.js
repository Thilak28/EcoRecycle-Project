const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  getAllAgencies,
  createAgency,
  getAllPickups,
  assignAgency,
  getReports,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// every route here requires admin role
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);

router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);

router.get("/agencies", getAllAgencies);
router.post("/agencies", createAgency);

router.get("/pickups", getAllPickups);
router.put("/assign-agency/:pickupId", assignAgency);

router.get("/reports", getReports);

module.exports = router;