import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole, IUser } from '../models/User';

interface JwtPayload {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser | undefined;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Lütfen giriş yapın' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user: IUser | null = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: 'Bu işlemi yapmak için yetkiniz bulunmamaktadır'
      });
      return;
    }
    next();
  };
}; 