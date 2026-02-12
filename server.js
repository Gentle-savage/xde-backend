const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Shipment = require("./models/Shipment");

const app = express();

app.use(cors());
app.use(express.json());

// ============================
// MONGODB CONNECTION
// ============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// ============================
// ADMIN MODEL
// ============================
const adminSchema = new mongoose.Schema({
  password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

// ============================
// INITIALIZE ADMIN (ONLY IF NOT EXISTS)
// ============================
async function initializeAdmin() {
  const existingAdmin = await Admin.findOne();

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("XDE2026Secure", 10);

    await Admin.create({
      password: hashedPassword,
    });

    console.log("Default Admin Created");
  }
}

initializeAdmin();

// ============================
// ADMIN LOGIN
// ============================
app.post("/admin-login", async (req, res) => {
  const { password } = req.body;

  const admin = await Admin.findOne();
  if (!admin) return res.status(500).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  res.json({ success: true });
});

// ============================
// ADMIN CHANGE PASSWORD
// ============================
app.post("/admin-change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const admin = await Admin.findOne();
  if (!admin) return res.status(500).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(oldPassword, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Old password incorrect" });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  admin.password = newHash;
  await admin.save();

  res.json({ message: "Password updated successfully" });
});

// ============================
// ADMIN RESET PASSWORD (MASTER RESET)
// ============================
// 🔐 YOUR SECRET RESET KEY:
const MASTER_RESET_KEY = "XDE_MASTER_KEY_94721";

app.post("/admin-reset-password", async (req, res) => {
  const { secretKey, newPassword } = req.body;

  if (secretKey !== MASTER_RESET_KEY) {
    return res.status(403).json({ message: "Unauthorized reset attempt" });
  }

  const admin = await Admin.findOne();
  if (!admin) return res.status(500).json({ message: "Admin not found" });

  const newHash = await bcrypt.hash(newPassword, 10);
  admin.password = newHash;
  await admin.save();

  res.json({ message: "Admin password reset successfully" });
});

// ============================
// TRACKING SYSTEM
// ============================
function generateTrackingNumber() {
  return "XDE" + Math.floor(100000000 + Math.random() * 900000000);
}

app.post("/create-shipment", async (req, res) => {
  try {
    const shipment = new Shipment({
      trackingNumber: generateTrackingNumber(),
      ...req.body,
      history: [
        {
          location: req.body.origin,
          message: "Shipment created",
        },
      ],
    });

    await shipment.save();
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/update-status/:trackingNumber", async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber,
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    shipment.status = req.body.status;
    shipment.currentLocation = req.body.currentLocation;

    shipment.history.push({
      location: req.body.currentLocation,
      message: req.body.message,
    });

    await shipment.save();

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/track/:trackingNumber", async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber,
    });

    if (!shipment) {
      return res.status(404).json({ message: "Tracking number not found" });
    }

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/all-shipments", async (req, res) => {
  const shipments = await Shipment.find().sort({ createdAt: -1 });
  res.json(shipments);
});

app.delete("/delete-shipment/:trackingNumber", async (req, res) => {
  await Shipment.findOneAndDelete({
    trackingNumber: req.params.trackingNumber,
  });

  res.json({ message: "Shipment deleted successfully" });
});

app.get("/", (req, res) => {
  res.send("XDE Logistics API Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
