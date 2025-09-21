const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  attempts: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 600 // 10 minutes expiry
  }
});

// Index for faster queries
OTPSchema.index({ email: 1 });
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('OTP', OTPSchema);
