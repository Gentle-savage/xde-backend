const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Shipment = require("./models/Shipment");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Generate Tracking Number
function generateTrackingNumber() {
  return "XDE" + Math.floor(100000000 + Math.random() * 900000000);
}

// Create Shipment
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

// Update Shipment Status (Admin Use Later)
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

// Track Shipment
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

app.get("/", (req, res) => {
  res.send("XDE Logistics API Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
