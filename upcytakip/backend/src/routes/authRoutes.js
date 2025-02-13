const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    // Şifre kontrolü (gerçek uygulamada hash kontrolü yapılmalı)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Son giriş tarihini güncelle
    user.lastLogin = new Date();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Giriş yapılırken bir hata oluştu' });
  }
});

// Kullanıcı bilgilerini getir
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token bulunamadı' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Geçersiz token' });
  }
});

module.exports = router; 