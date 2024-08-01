
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '15m' } // OTP expires in 15 minutes
});

module.exports = mongoose.model('Otp', otpSchema);
