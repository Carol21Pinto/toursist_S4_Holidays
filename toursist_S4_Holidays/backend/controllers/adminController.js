const Admin = require('../models/Admin');
const OTP = require('../models/OTP'); // NEW
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOTPEmail } = require('../services/emailService'); // NEW

// LOGIN (unchanged)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// LOGOUT (unchanged)
exports.logout = async (req, res) => {
  try {
    console.log('Admin logout request received');
    
    const adminId = req.admin;
    console.log(`Admin ${adminId} logged out at ${new Date()}`);
    
    return res.status(200).json({ 
      message: 'Logout successful' 
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};

// REGISTER (unchanged)
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();
    return res.status(201).json({ message: 'Admin registered' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// NEW: STEP 1 - Request OTP
exports.forgotPasswordRequestOTP = async (req, res) => {
  try {
    const { email } = req.body || {};
    
    // Validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'No admin found with this email address' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Clear any existing OTPs for this email
    await OTP.deleteMany({ email });
    
    // Save new OTP
    await OTP.create({ email, otp });
    
    // Send email
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

    console.log(`OTP sent to ${email}: ${otp}`); // Remove in production
    
    return res.status(200).json({ 
      success: true,
      message: 'OTP sent successfully to your email address',
      email: email // Send back email for frontend reference
    });

  } catch (err) {
    console.error('OTP request error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// NEW: STEP 2 - Verify OTP
exports.forgotPasswordVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    
    // Validation
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'Too many invalid attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await OTP.updateOne({ email }, { $inc: { attempts: 1 } });
      return res.status(400).json({ 
        message: `Invalid OTP. ${2 - otpRecord.attempts} attempts remaining.` 
      });
    }

    // OTP is valid - generate reset token
    const resetToken = jwt.sign(
      { email, purpose: 'password-reset' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    // Delete OTP after successful verification
    await OTP.deleteOne({ email });

    return res.status(200).json({ 
      success: true,
      message: 'OTP verified successfully',
      resetToken: resetToken
    });

  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// NEW: STEP 3 - Reset Password
exports.forgotPasswordReset = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body || {};
    
    // Validation
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    // Find admin
    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await Admin.findByIdAndUpdate(admin._id, { password: hashedPassword });

    console.log(`Password reset successful for ${decoded.email}`);

    return res.status(200).json({ 
      success: true,
      message: 'Password updated successfully' 
    });

  } catch (err) {
    console.error('Password reset error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// KEEP OLD METHOD for backward compatibility (but mark as deprecated)
exports.forgotPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body || {};
    
    // Validation
    if (!username || !newPassword) {
      return res.status(400).json({ message: 'Username and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find admin by email (username is email in your case)
    const admin = await Admin.findOne({ email: username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found with this email' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    await Admin.findByIdAndUpdate(admin._id, { password: hashedPassword });

    return res.status(200).json({ 
      success: true,
      message: 'Password updated successfully' 
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
