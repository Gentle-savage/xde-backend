const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("XDE Logistics API Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
