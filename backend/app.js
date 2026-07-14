const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const pickupRoutes = require("./routes/pickup.routes");
const agencyRoutes = require("./routes/agency.routes");
const adminRoutes = require("./routes/admin.routes");
const notificationRoutes = require("./routes/notification.routes"); // ← new
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/agency", agencyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes); // ← new

app.use(errorHandler);

module.exports = app;