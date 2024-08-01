
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Define the User schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['staff', 'doctor'], required: true } // Add role field
});

// Middleware to hash the password before saving the user
UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) { // Check if the password field has been modified
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
      user.password = await bcrypt.hash(user.password, salt); // Hash the password with the generated salt
      next(); // Proceed to the next middleware
    } catch (error) {
      next(error); // Pass any errors to the next middleware
    }
  } else {
    next(); // Proceed to the next middleware if the password is not modified
  }
});

module.exports = mongoose.model('User', UserSchema); // Export the User model
