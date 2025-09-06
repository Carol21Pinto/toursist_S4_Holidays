const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN (returns JWT)
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

// LOGOUT - NEW FUNCTION
exports.logout = async (req, res) => {
  try {
    // For JWT tokens, we can't invalidate them server-side without a blacklist
    // But we can perform cleanup operations here
    
    console.log('Admin logout request received');
    
    // Optional: Add token to blacklist (if you implement one)
    // const token = req.headers['authorization']?.split(' ')[1];
    // await addToTokenBlacklist(token);
    
    // Optional: Log logout activity
    const adminId = req.admin; // From auth middleware
    console.log(`Admin ${adminId} logged out at ${new Date()}`);
    
    // Send success response
    return res.status(200).json({ 
      message: 'Logout successful' 
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};

// FIRST-TIME ONLY — Admin Registration
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
