'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';

interface SubmitStatus {
  type: 'success' | 'error';
  message: string;
}

interface FormData {
  paperType: string;
  region: string;
  minPrice: string;
  maxPrice: string;
  averagePrice: string;
  source: string;
  date: string;
}

export default function VeriGirisPage() {
  const [formData, setFormData] = useState<FormData>({
    paperType: '',
    region: '',
    minPrice: '',
    maxPrice: '',
    averagePrice: '',
    source: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  // Ortalama fiyatı otomatik hesapla
  useEffect(() => {
    if (formData.minPrice && formData.maxPrice) {
      const min = parseFloat(formData.minPrice);
      const max = parseFloat(formData.maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        const avg = ((min + max) / 2).toFixed(2);
        setFormData(prev => ({
          ...prev,
          averagePrice: avg
        }));
      }
    }
  }, [formData.minPrice, formData.maxPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Form validasyonları
    const minPrice = parseFloat(formData.minPrice);
    const maxPrice = parseFloat(formData.maxPrice);

    // Negatif değer kontrolü
    if (minPrice < 0 || maxPrice < 0) {
      setSubmitStatus({
        type: 'error',
        message: 'Fiyatlar negatif olamaz'
      });
      setIsSubmitting(false);
      return;
    }

    // Maksimum değer kontrolü (örn: 1000 TL/kg üstü mantıksız olabilir)
    if (minPrice > 1000 || maxPrice > 1000) {
      setSubmitStatus({
        type: 'error',
        message: 'Girilen fiyat değerleri çok yüksek, lütfen kontrol ediniz'
      });
      setIsSubmitting(false);
      return;
    }

    // Minimum/Maksimum fiyat kontrolü
    if (minPrice > maxPrice) {
      setSubmitStatus({
        type: 'error',
        message: 'Minimum fiyat, maksimum fiyattan büyük olamaz'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Veri kaydedilirken bir hata oluştu');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Veri başarıyla kaydedildi'
      });
      
      // Formu sıfırla ve kullanıcıya bilgi ver
      setFormData({
        paperType: '',
        region: '',
        minPrice: '',
        maxPrice: '',
        averagePrice: '',
        source: '',
        date: new Date().toISOString().split('T')[0]
      });

      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Bir hata oluştu'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Fiyat Veri Girişi
          </h1>

          {/* Status mesajları */}
          {submitStatus && (
            <div
              className={`mb-4 p-4 rounded-md ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="paperType" className="block text-sm font-medium text-gray-700">
                  Kağıt Türü
                </label>
                <select
                  id="paperType"
                  name="paperType"
                  value={formData.paperType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Seçiniz</option>
                  <option value="occ">OCC (Oluklu Mukavva)</option>
                  <option value="mixed_paper">Karışık Kağıt</option>
                  <option value="newspaper">Gazete</option>
                  <option value="white_paper">1. Hamur Beyaz Kağıt</option>
                  <option value="colored_paper">Renkli Kağıt</option>
                  <option value="kraft">Kraft Kağıt</option>
                  <option value="coated">Kuşe Kağıt</option>
                </select>
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                  Bölge
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Seçiniz</option>
                  <option value="marmara">Marmara</option>
                  <option value="ege">Ege</option>
                  <option value="ic_anadolu">İç Anadolu</option>
                  <option value="akdeniz">Akdeniz</option>
                  <option value="karadeniz">Karadeniz</option>
                  <option value="dogu_anadolu">Doğu Anadolu</option>
                  <option value="guneydogu">Güneydoğu</option>
                </select>
              </div>

              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                  Minimum Fiyat (₺/kg)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  id="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                  Maksimum Fiyat (₺/kg)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  id="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="averagePrice" className="block text-sm font-medium text-gray-700">
                  Ortalama Fiyat (₺/kg)
                </label>
                <input
                  type="number"
                  name="averagePrice"
                  id="averagePrice"
                  value={formData.averagePrice}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                  Kaynak
                </label>
                <input
                  type="text"
                  name="source"
                  id="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Opsiyonel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Tarih
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>

            {submitStatus && (
              <div
                className={`mt-4 p-4 rounded-md ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </MainLayout>
  );
} 