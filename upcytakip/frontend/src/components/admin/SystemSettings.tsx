'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToken } from '@/utils/auth';

interface SystemConfig {
  apiRateLimit: number;
  maxFileSize: number;
  dataRetentionDays: number;
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  maintenanceMode: boolean;
  debugMode: boolean;
}

export default function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>({
    apiRateLimit: 1000,
    maxFileSize: 10,
    dataRetentionDays: 90,
    backupEnabled: true,
    backupFrequency: 'daily',
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    maintenanceMode: false,
    debugMode: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/api/admin/system/config', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) throw new Error('Ayarlar güncellenirken bir hata oluştu');

      toast.success('Sistem ayarları başarıyla güncellendi');
    } catch (error) {
      toast.error('Sistem ayarları güncellenirken bir hata oluştu');
      console.error('Sistem ayarları güncelleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/api/admin/system/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Yedekleme işlemi başarısız oldu');

      toast.success('Sistem yedeklemesi başarıyla oluşturuldu');
    } catch (error) {
      toast.error('Yedekleme işlemi başarısız oldu');
      console.error('Yedekleme hatası:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/api/admin/system/cache', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Önbellek temizleme işlemi başarısız oldu');

      toast.success('Sistem önbelleği başarıyla temizlendi');
    } catch (error) {
      toast.error('Önbellek temizleme işlemi başarısız oldu');
      console.error('Önbellek temizleme hatası:', error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* API ve Performans */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">API ve Performans</h3>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label htmlFor="apiRateLimit" className="block text-sm font-medium text-gray-700">
                API İstek Limiti (dakika başına)
              </label>
              <input
                type="number"
                id="apiRateLimit"
                value={config.apiRateLimit}
                onChange={(e) => handleChange('apiRateLimit', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700">
                Maksimum Dosya Boyutu (MB)
              </label>
              <input
                type="number"
                id="maxFileSize"
                value={config.maxFileSize}
                onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Veri ve Yedekleme */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Veri ve Yedekleme</h3>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label htmlFor="dataRetentionDays" className="block text-sm font-medium text-gray-700">
                Veri Saklama Süresi (gün)
              </label>
              <input
                type="number"
                id="dataRetentionDays"
                value={config.dataRetentionDays}
                onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
                Yedekleme Sıklığı
              </label>
              <select
                id="backupFrequency"
                value={config.backupFrequency}
                onChange={(e) => handleChange('backupFrequency', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="backupEnabled"
                checked={config.backupEnabled}
                onChange={(e) => handleChange('backupEnabled', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="backupEnabled" className="ml-2 block text-sm text-gray-900">
                Otomatik Yedekleme
              </label>
            </div>
          </div>
        </div>

        {/* Bildirimler */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirimler</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={config.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                E-posta Bildirimleri
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="smsNotifications"
                checked={config.smsNotifications}
                onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                SMS Bildirimleri
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={config.pushNotifications}
                onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-900">
                Push Bildirimleri
              </label>
            </div>
          </div>
        </div>

        {/* Sistem Durumu */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Durumu</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={config.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                Bakım Modu
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="debugMode"
                checked={config.debugMode}
                onChange={(e) => handleChange('debugMode', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="debugMode" className="ml-2 block text-sm text-gray-900">
                Debug Modu
              </label>
            </div>
          </div>
        </div>

        {/* Sistem İşlemleri */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem İşlemleri</h3>
          <div className="space-x-4">
            <button
              type="button"
              onClick={handleBackup}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Manuel Yedekleme
            </button>
            <button
              type="button"
              onClick={handleClearCache}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Önbelleği Temizle
            </button>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 