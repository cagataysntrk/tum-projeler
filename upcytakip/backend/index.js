const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Çevre değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// Middleware'leri ayarla
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Rotaları içe aktar
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Rotaları kullan
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Ana route
app.get('/', (req, res) => {
  res.json({ message: 'UpcyTakip API aktif' });
});

// Hata yakalama middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Bir hata oluştu' });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
}); 