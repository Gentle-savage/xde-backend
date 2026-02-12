const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: { type: String, unique: true },

    senderName: String,
    senderAddress: String,
 
    receiverName: String,
    receiverAddress: String,
    receiverPhone: String,

    origin: String,
    destination: String,

    status: {
      type: String,
      enum: ["Processing", "In Transit", "Out for Delivery", "Delivered"],
      default: "Processing",
    },

    currentLocation: String,
    estimatedDelivery: Date,

    history: [
      {
        location: String,
        message: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", shipmentSchema);
