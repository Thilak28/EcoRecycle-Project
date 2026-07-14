require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@ecorecycle.com" });
    if (existing) {
      console.log("Admin already exists. Skipping.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@ecorecycle.com",
      password: hashedPassword,
      phone: "9999999999",
      role: "admin",
      isBlocked: false,
    });

    console.log("✅ Admin created: admin@ecorecycle.com / admin123");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();