const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Lütfen giriş yapın' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Hesabınız aktif değil' });
    }

    // Abonelik kontrolü
    if (!user.isSubscriptionActive()) {
      return res.status(403).json({ 
        error: 'Aboneliğiniz sona ermiş',
        subscriptionExpired: true
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Lütfen tekrar giriş yapın' });
  }
};

module.exports = auth; 