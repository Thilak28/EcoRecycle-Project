const express = require("express");
const router = express.Router();
const { createPickup, getMyPickups, getPickupById } = require("../controllers/pickup.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", protect, authorize("user"), upload.single("image"), createPickup);
router.get("/my", protect, authorize("user"), getMyPickups);
router.get("/:id", protect, getPickupById);

module.exports = router;