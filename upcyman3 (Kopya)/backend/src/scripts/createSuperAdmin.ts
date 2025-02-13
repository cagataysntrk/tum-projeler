import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, UserRole } from '../models/User';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB\'ye bağlanıldı');

    const superAdminData = {
      username: 'superadmin',
      email: 'superadmin@upcyman.com',
      password: 'Upcyman123!',
      role: UserRole.SUPER_ADMIN
    };

    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ email: superAdminData.email });
    if (existingUser) {
      console.log('SUPER_ADMIN kullanıcısı zaten mevcut');
      process.exit(0);
    }

    // Yeni SUPER_ADMIN oluştur
    const superAdmin = await User.create(superAdminData);
    console.log('SUPER_ADMIN başarıyla oluşturuldu:', {
      username: superAdmin.username,
      email: superAdmin.email,
      role: superAdmin.role
    });

    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

createSuperAdmin(); 