const mongoose = require("mongoose");

const HealthRecordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  healthData: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("HealthRecord", HealthRecordSchema);
