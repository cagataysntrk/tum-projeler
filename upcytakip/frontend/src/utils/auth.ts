import { UserRole } from '@/types';

export const roleCheck = (requiredRoles: UserRole[]): boolean => {
  if (typeof window === 'undefined') return false;

  const user = localStorage.getItem('user');
  if (!user) return false;

  const { role } = JSON.parse(user);
  return requiredRoles.includes(role as UserRole) || role === 'superadmin';
};

export const isAdmin = (): boolean => {
  return roleCheck(['sistem_admin', 'superadmin']);
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;

  const user = localStorage.getItem('user');
  if (!user) return null;

  return JSON.parse(user);
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}; 