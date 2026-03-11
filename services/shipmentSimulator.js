const Shipment = require("../models/Shipment");

const route = [
  {
    location: "Shanghai Port",
    latitude: 31.2304,
    longitude: 121.4737
  },
  {
    location: "Dubai Hub",
    latitude: 25.2048,
    longitude: 55.2708
  },
  {
    location: "Berlin Hub",
    latitude: 52.5200,
    longitude: 13.4050
  },
  {
    location: "Paris Hub",
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    location: "Lagos Distribution Center",
    latitude: 6.5244,
    longitude: 3.3792
  }
];

let index = 0;

const startShipmentSimulator = () => {

  setInterval(async () => {

    try {

      const shipments = await Shipment.find({
        status: { $ne: "Delivered" }
      });

      shipments.forEach(async shipment => {

        if(index >= route.length) return;

        const step = route[index];

        shipment.currentLocation = step.location;
        shipment.status = "In Transit";

        shipment.history.push({
          status: "In Transit",
          location: step.location,
          latitude: step.latitude,
          longitude: step.longitude,
          description: `Shipment arrived at ${step.location}`
        });

        if(index === route.length - 1){
          shipment.status = "Delivered";
        }

        await shipment.save();

      });

      index++;

      if(index >= route.length){
        index = 0;
      }

      console.log("🚚 Shipment simulator moved to next checkpoint");

    } catch(error){
      console.error("Simulator error:", error.message);
    }

  },15000); // every 15 seconds

};

module.exports = startShipmentSimulator;