const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Signup attempt for email:', email, 'name:', name);
    
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    console.log('Creating new user...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, passwordHash });
    await user.save();
    
    console.log('User created successfully:', email);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ error: 'Invalid credentials - user not found' });
    }
    
    console.log('User found, checking password...');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log('Password mismatch for email:', email);
      return res.status(400).json({ error: 'Invalid credentials - incorrect password' });
    }
    
    console.log('Login successful for:', email);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
