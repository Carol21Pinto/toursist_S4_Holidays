const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN (returns JWT) - YOUR EXISTING CODE UNCHANGED
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

// LOGOUT - YOUR EXISTING CODE UNCHANGED
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

// REGISTER - YOUR EXISTING CODE UNCHANGED
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

// NEW: FORGOT PASSWORD FUNCTION - ADD THIS
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
