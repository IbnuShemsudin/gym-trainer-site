const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, roleRequest, adminSecret } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // 2. Role Logic: Only grant 'admin' if the secret key matches
    let assignedRole = 'client';
    if (roleRequest === 'admin') {
      if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: "Invalid Admin Authorization Key" });
      }
      assignedRole = 'admin';
    }

    // 3. Hash Password & Save
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    res.status(201).json({ message: "User Created", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Include the ROLE in the JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      role: user.role, // Send role back to frontend for routing
      name: user.name 
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};