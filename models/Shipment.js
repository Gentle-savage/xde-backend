const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  senderName: String,
  receiverName: String,
  origin: String,
  destination: String,
  status: {
    type: String,
    default: "Processing",
  },
  currentLocation: String,
  estimatedDelivery: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shipment", ShipmentSchema);
