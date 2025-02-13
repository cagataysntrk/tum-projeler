import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole, IUser } from '../models/User';

const generateToken = (id: string, role: UserRole): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400).json({
        message: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor'
      });
      return;
    }

    // Sadece SUPER_ADMIN diğer SUPER_ADMIN'leri oluşturabilir
    if (role === UserRole.SUPER_ADMIN) {
      if (!req.user || req.user.role !== UserRole.SUPER_ADMIN) {
        res.status(403).json({
          message: 'SUPER_ADMIN oluşturma yetkiniz yok'
        });
        return;
      }
    }

    const user: IUser = await User.create({
      username,
      email,
      password,
      role: role || UserRole.DATA_ENTRY
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: 'Geçersiz e-posta veya şifre'
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        message: 'Geçersiz e-posta veya şifre'
      });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Yetkilendirme başarısız' });
      return;
    }

    const user: IUser | null = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
}; 