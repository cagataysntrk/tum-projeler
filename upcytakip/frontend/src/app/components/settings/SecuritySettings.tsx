'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SecuritySettings() {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Şifre başarıyla güncellendi');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleTwoFactorToggle = async () => {
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`İki faktörlü doğrulama ${twoFactorEnabled ? 'devre dışı bırakıldı' : 'etkinleştirildi'}`);
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Şifre Değiştirme */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Şifre Değiştirme</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Mevcut Şifre
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Yeni Şifre
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Şifreyi Güncelle
            </button>
          </div>
        </form>
      </div>

      {/* İki Faktörlü Doğrulama */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">İki Faktörlü Doğrulama</h3>
            <p className="mt-1 text-sm text-gray-500">
              Hesabınızı daha güvenli hale getirmek için iki faktörlü doğrulamayı etkinleştirin
            </p>
          </div>
          <button
            type="button"
            onClick={handleTwoFactorToggle}
            className={`${
              twoFactorEnabled
                ? 'bg-primary-600'
                : 'bg-gray-200'
            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            <span className="sr-only">İki faktörlü doğrulamayı aç/kapat</span>
            <span
              className={`${
                twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
            />
          </button>
        </div>
      </div>
    </div>
  );
} 