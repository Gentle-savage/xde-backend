// ---------------- DNS FIX (Important for Windows + MongoDB Atlas) ----------------
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

// ---------------- LOAD ENV VARIABLES ----------------
require("dotenv").config();

// ---------------- DEPENDENCIES ----------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ---------------- IMPORT ROUTES ----------------
const adminAuthRoutes = require("./routes/adminAuth");
const adminDashboardRoutes = require("./routes/adminDashboard");
const shipmentRoutes = require("./routes/shipmentRoutes");
const startShipmentSimulator = require("./services/shipmentSimulator");

// ---------------- INITIALIZE APP ----------------
const app = express();

// ---------------- GLOBAL MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- API ROUTES ----------------
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/shipments", shipmentRoutes);

// ---------------- HEALTH CHECK ROUTE ----------------
app.get("/", (req, res) => {
  res.send("🚀 XDE Logistics API Running");
});

// ---------------- DATABASE CONNECTION ----------------
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4
  })
  .then(() => {
  console.log("✅ MongoDB Connected Successfully");

  startShipmentSimulator(); // start auto shipment movement
})
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
  });

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});