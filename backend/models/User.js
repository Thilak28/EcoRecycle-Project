const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true },
    role: { type: String, enum: ["user", "agency", "admin"], default: "user" },
    rewardPoints: { type: Number, default: 0 },
    profileImage: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },

    // Agency-specific fields — only used when role === "agency"
    agencyName: { type: String, default: "" },
    serviceArea: { type: String, default: "" },
    workersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);