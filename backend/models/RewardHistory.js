const mongoose = require("mongoose");

const rewardHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pickup: { type: mongoose.Schema.Types.ObjectId, ref: "PickupRequest", required: true },
    earnedPoints: { type: Number, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RewardHistory", rewardHistorySchema);
