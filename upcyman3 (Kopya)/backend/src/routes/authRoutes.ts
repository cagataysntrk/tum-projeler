import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// Kullanıcı kaydı - Sadece SUPER_ADMIN yeni kullanıcı oluşturabilir
router.post('/register', protect, authorize(UserRole.SUPER_ADMIN), register);

// Giriş
router.post('/login', login);

// Mevcut kullanıcı bilgilerini getir
router.get('/me', protect, getMe);

export default router; 