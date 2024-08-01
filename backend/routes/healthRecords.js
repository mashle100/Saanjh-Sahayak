const express = require("express");
const router = express.Router();
const HealthRecord = require("../models/HealthRecord");

// Add a health record
router.post("/", async (req, res) => {
  const { name, age, healthData } = req.body;

  try {
    const newRecord = new HealthRecord({ name, age, healthData });
    const record = await newRecord.save();
    res.json(record);
  } catch (error) {
    console.error("Error saving health record: ", error);
    res.status(500).json({ error: "Error saving health record." });
  }
});

// Get all health records
router.get("/", async (req, res) => {
  try {
    const records = await HealthRecord.find();
    res.json(records);
  } catch (error) {
    console.error("Error fetching health records: ", error);
    res.status(500).json({ error: "Error fetching health records." });
  }
});

module.exports = router;
