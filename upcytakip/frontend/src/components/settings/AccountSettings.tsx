'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AccountSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    language: 'tr',
    timezone: 'Europe/Istanbul'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checkbox.checked
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    <div className="space-y-8 p-6">
      {/* Bildirim Tercihleri */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirim Tercihleri</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email"
              name="email"
              checked={settings.notifications.email}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="email" className="ml-3 text-sm text-gray-700">
              E-posta bildirimleri
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sms"
              name="sms"
              checked={settings.notifications.sms}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="sms" className="ml-3 text-sm text-gray-700">
              SMS bildirimleri
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="push"
              name="push"
              checked={settings.notifications.push}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="push" className="ml-3 text-sm text-gray-700">
              Push bildirimleri
            </label>
          </div>
        </div>
      </div>

      {/* Bölgesel Ayarlar */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bölgesel Ayarlar</h3>
        <div className="space-y-4">
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

      {/* Kaydet Butonu */}
      <div className="flex justify-end border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
} 