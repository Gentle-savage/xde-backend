const express = require("express");
const router = express.Router();

const Shipment = require("../models/shipment");
const protect = require("../middleware/authMiddleware");


// ADMIN DASHBOARD STATS
router.get("/dashboard", protect, async (req, res) => {
  try {

    const totalShipments = await Shipment.countDocuments();

    const processing = await Shipment.countDocuments({ status: "Processing" });

    const inTransit = await Shipment.countDocuments({ status: "In Transit" });

    const delivered = await Shipment.countDocuments({ status: "Delivered" });

    const delayed = await Shipment.countDocuments({ status: "Delayed" });


    res.json({
      totalShipments,
      processing,
      inTransit,
      delivered,
      delayed
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;