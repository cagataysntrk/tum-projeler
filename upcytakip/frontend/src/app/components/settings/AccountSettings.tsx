'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AccountSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: 'tr',
    timezone: 'Europe/Istanbul'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Ayarlar başarıyla güncellendi');
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirim Tercihleri</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                E-posta Bildirimleri
              </label>
              <p className="text-sm text-gray-500">Fiyat değişiklikleri ve önemli güncellemeler hakkında e-posta alın</p>
            </div>
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                SMS Bildirimleri
              </label>
              <p className="text-sm text-gray-500">Acil durumlar için SMS bildirimleri alın</p>
            </div>
            <input
              type="checkbox"
              id="smsNotifications"
              name="smsNotifications"
              checked={settings.smsNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                Push Bildirimleri
              </label>
              <p className="text-sm text-gray-500">Anlık bildirimler alın</p>
            </div>
            <input
              type="checkbox"
              id="pushNotifications"
              name="pushNotifications"
              checked={settings.pushNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bölgesel Ayarlar</h3>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Dil
            </label>
            <select
              id="language"
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              Saat Dilimi
            </label>
            <select
              id="timezone"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
              <option value="Europe/London">Londra (UTC+0)</option>
              <option value="America/New_York">New York (UTC-5)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Değişiklikleri Kaydet
        </button>
      </div>
    </form>
  );
} 