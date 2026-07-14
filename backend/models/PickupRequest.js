const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedAgency: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // ← fixed: was "Agency"

    category: {
      type: String,
      enum: ["Mobile Phone", "Laptop", "Battery", "Television", "Other"],
      required: true,
    },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    condition: {
      type: String,
      enum: ["Working", "Not Working", "Damaged"],
      required: true,
    },
    description: { type: String, default: "" },

    pickupAddress: { type: String, required: true },
    preferredPickupDate: { type: Date, required: true },

    image: { type: String, default: "" },

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Accepted",
        "Out for Pickup",
        "Collected",
        "Delivered to Recycling Center",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    rewardPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PickupRequest", pickupRequestSchema);