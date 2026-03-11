const mongoose = require("mongoose");

/*
=====================================
SHIPMENT HISTORY (TIMELINE EVENTS)
=====================================
*/

const historySchema = new mongoose.Schema({
  status: String,
  location: String,
  description: String,
  latitude: Number,
  longitude: Number,
  time: {
    type: Date,
    default: Date.now
  }
});


/*
=====================================
MAIN SHIPMENT SCHEMA
=====================================
*/

const shipmentSchema = new mongoose.Schema(
{
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  senderName: {
    type: String,
    required: true
  },

  senderAddress: {
    type: String,
    required: true
  },

  senderPhone: {
    type: String,
    required: true
  },

  receiverName: {
    type: String,
    required: true
  },

  receiverAddress: {
    type: String,
    required: true
  },

  receiverPhone: {
    type: String,
    required: true
  },

  origin: {
    type: String,
    required: true
  },

  destination: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: [
      "Processing",
      "In Transit",
      "Out for Delivery",
      "Delivered",
      "Delayed"
    ],
    default: "Processing"
  },

  currentLocation: {
    type: String,
    default: "Warehouse"
  },

  estimatedDelivery: {
    type: Date
  },

  history: [historySchema]

},
{ timestamps: true }
);


module.exports = mongoose.model("Shipment", shipmentSchema);