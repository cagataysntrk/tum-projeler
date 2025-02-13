'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import GlobalPrices from '@/components/stats/GlobalPrices';
import RegionalComparison from '@/components/stats/RegionalComparison';
import CurrencyEffects from '@/components/stats/CurrencyEffects';
import ExchangeRates from '@/components/stats/ExchangeRates';

export default function StatsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // API çağrıları burada yapılacak
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock loading
      } catch (err) {
        setError('Veri yüklenirken bir hata oluştu');
        console.error('Veri yükleme hatası:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-600">{error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Piyasa Trend ve Global Karşılaştırma
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {/* Global Fiyatlar & Döviz Etkisi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlobalPrices />
            <CurrencyEffects />
          </div>

          {/* Döviz Kurları */}
          <ExchangeRates />

          {/* Bölgesel Kıyaslama */}
          <RegionalComparison />
        </div>
      </div>
    </MainLayout>
  );
} 