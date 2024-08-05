
const mongoose = require("mongoose");

// const patientSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   gender: String,
//   address: String,
//   contactNumber: String,
//   healthRecords: [
//     {
//       filename: String,
//       path: String,
//       mimetype: String,
//     },
//   ],
//   summary: String,
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   createdAt: { type: Date, default: Date.now },
// });
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  healthRecords: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true },
      mimetype: { type: String, required: true }
    }
  ],
  summary: { type: String, default: '' }, 
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", patientSchema);
