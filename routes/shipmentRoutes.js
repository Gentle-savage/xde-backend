const express = require("express");
const router = express.Router();

const Shipment = require("../models/Shipment");
const protect = require("../middleware/authMiddleware");


/*
=====================================
CREATE SHIPMENT (Admin)
POST /api/shipments
=====================================
*/
router.post("/", protect, async (req, res) => {
  try {

    const shipment = new Shipment(req.body);

    await shipment.save();

    res.status(201).json(shipment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=====================================
GET ALL SHIPMENTS (Admin)
GET /api/shipments
=====================================
*/
router.get("/", protect, async (req, res) => {
  try {

    const shipments = await Shipment.find();

    res.json(shipments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=====================================
PUBLIC TRACK SHIPMENT
GET /api/shipments/track/:trackingNumber
=====================================
*/
router.get("/track/:trackingNumber", async (req, res) => {
  try {

    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.json(shipment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=====================================
PUBLIC TIMELINE
GET /api/shipments/timeline/:trackingNumber
=====================================
*/
router.get("/timeline/:trackingNumber", async (req, res) => {
  try {

    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.json({
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      currentLocation: shipment.currentLocation,
      estimatedDelivery: shipment.estimatedDelivery,
      history: shipment.history
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=====================================
MAP TRACKING API
GET /api/shipments/map/:trackingNumber
=====================================
*/
router.get("/map/:trackingNumber", async (req, res) => {
  try {

    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const route = shipment.history.map(event => ({
      location: event.location,
      latitude: event.latitude,
      longitude: event.longitude,
      time: event.time
    }));

    res.json({
      trackingNumber: shipment.trackingNumber,
      currentLocation: shipment.currentLocation,
      route
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=====================================
UPDATE SHIPMENT + ADD TIMELINE EVENT
PUT /api/shipments/:trackingNumber
=====================================
*/
router.put("/:trackingNumber", protect, async (req, res) => {
  try {

    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const { status, currentLocation, description, latitude, longitude } = req.body;

    if (status) shipment.status = status;
    if (currentLocation) shipment.currentLocation = currentLocation;

    shipment.history.push({
      status: status || shipment.status,
      location: currentLocation || shipment.currentLocation,
      description: description || "Shipment update",
      latitude: latitude || null,
      longitude: longitude || null
    });

    await shipment.save();

    res.json(shipment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=====================================
DELETE SHIPMENT
DELETE /api/shipments/:trackingNumber
=====================================
*/
router.delete("/:trackingNumber", protect, async (req, res) => {
  try {

    const shipment = await Shipment.findOneAndDelete({
      trackingNumber: req.params.trackingNumber
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.json({ message: "Shipment deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;