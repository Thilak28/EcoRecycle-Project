const express = require("express");
const router = express.Router();
const { getAssignedPickups, updatePickupStatus, getAgencyHistory } = require("../controllers/agency.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.get("/pickups", protect, authorize("agency"), getAssignedPickups);
router.put("/pickups/:id/status", protect, authorize("agency"), updatePickupStatus);
router.get("/history", protect, authorize("agency"), getAgencyHistory);

module.exports = router;