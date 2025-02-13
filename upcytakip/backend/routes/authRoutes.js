const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Rol bazlı varsayılan rotalar
const DEFAULT_ROUTES = {
  superadmin: '/dashboard',
  veri_admin: '/dashboard',
  veri_girisci: '/veri-giris',
  veri_goruntuleyen: '/dashboard',
  sistem_admin: '/dashboard'
};

// Kayıt ol
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, company, phone, subscriptionType } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Bu email adresi zaten kayıtlı' });
    }

    // Abonelik bitiş tarihi (örnek: 1 ay)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    const user = new User({
      email,
      password,
      name,
      company,
      phone,
      subscriptionType,
      subscriptionEndDate
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscriptionType: user.subscriptionType,
        subscriptionEndDate: user.subscriptionEndDate
      },
      token,
      defaultRoute: DEFAULT_ROUTES[user.role] || '/dashboard'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Giriş yap
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Hesabınız aktif değil' });
    }

    // Son giriş tarihini güncelle
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscriptionType: user.subscriptionType,
        subscriptionEndDate: user.subscriptionEndDate
      },
      token,
      defaultRoute: DEFAULT_ROUTES[user.role] || '/dashboard'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Kullanıcı bilgilerini getir
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      user,
      defaultRoute: DEFAULT_ROUTES[user.role] || '/dashboard'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Abonelik yenileme
router.post('/subscription/renew', auth, async (req, res) => {
  try {
    const { subscriptionType } = req.body;
    const user = req.user;

    // Yeni bitiş tarihi (1 ay sonrası)
    const newEndDate = new Date();
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    user.subscriptionType = subscriptionType;
    user.subscriptionEndDate = newEndDate;
    await user.save();

    res.json({
      message: 'Abonelik başarıyla yenilendi',
      subscriptionType: user.subscriptionType,
      subscriptionEndDate: user.subscriptionEndDate
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 