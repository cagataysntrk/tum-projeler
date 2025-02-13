require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../models/User');

const createSuperAdmin = async () => {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut süper admin kontrolü
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Süper admin zaten mevcut:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Süper admin oluştur
    const superAdmin = new User({
      email: 'admin@upcytakip.com',
      password: 'Admin123!',  // Bu şifre otomatik olarak hashlenecek
      name: 'Sistem Yöneticisi',
      role: 'superadmin',
      subscriptionType: 'kurumsal',
      subscriptionEndDate: new Date('2099-12-31'), // Uzun vadeli bitiş tarihi
      isActive: true,
      company: 'UpcyTakip',
      phone: '+90 555 555 5555'
    });

    await superAdmin.save();
    console.log('Süper admin başarıyla oluşturuldu:', superAdmin.email);

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
  }
};

// Scripti çalıştır
createSuperAdmin(); 