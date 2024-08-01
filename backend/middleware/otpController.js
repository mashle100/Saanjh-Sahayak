const otpGenerator = require('otp-generator');

const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Simulate a database
const otpStore = {}; // Example: { userId: { otp, expiry } }

const generateOtp = async (userId) => {
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
  otpStore[userId] = { otp, expiry: Date.now() + OTP_EXPIRY };
  return otp;
};

const verifyOtp = async (userId, otp) => {
  const otpEntry = otpStore[userId];
  if (!otpEntry) return false;

  const isExpired = Date.now() > otpEntry.expiry;
  if (isExpired) {
    delete otpStore[userId];
    return false;
  }

  const isValid = otpEntry.otp === otp;
  if (isValid) {
    delete otpStore[userId];
  }
  return isValid;
};

module.exports = { generateOtp, verifyOtp };
