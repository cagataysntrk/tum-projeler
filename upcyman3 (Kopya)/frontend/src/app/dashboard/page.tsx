'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InfoCard from '@/components/dashboard/InfoCard';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import NotificationPanel from '@/components/dashboard/NotificationPanel';
import DetailedDataPanel from '@/components/dashboard/DetailedDataPanel';
import OperationsList from '@/components/dashboard/OperationsList';
import FacilityEfficiency from '@/components/dashboard/FacilityEfficiency';
import PendingTasks from '@/components/dashboard/PendingTasks';
import {
  ArrowDownTrayIcon,
  CogIcon,
  ShoppingCartIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

// Örnek veri - Gerçek uygulamada API'den gelecek
const mockPerformanceData = [
  { date: '2024-02-01', wasteInput: 2450, processedMaterial: 1850, sales: 1500 },
  { date: '2024-02-02', wasteInput: 2600, processedMaterial: 2000, sales: 1650 },
  { date: '2024-02-03', wasteInput: 2300, processedMaterial: 1900, sales: 1400 },
  { date: '2024-02-04', wasteInput: 2800, processedMaterial: 2200, sales: 1800 },
  { date: '2024-02-05', wasteInput: 2500, processedMaterial: 2100, sales: 1700 },
  { date: '2024-02-06', wasteInput: 2700, processedMaterial: 2300, sales: 1900 },
  { date: '2024-02-07', wasteInput: 2900, processedMaterial: 2400, sales: 2000 },
];

const mockNotifications = [
  {
    id: '1',
    title: 'Düşük Stok Uyarısı',
    message: 'PET şişe stoku kritik seviyenin altına düştü.',
    type: 'warning' as const,
    timestamp: '10 dakika önce'
  },
  {
    id: '2',
    title: 'Bakım Hatırlatması',
    message: 'Yarın 09:00\'da Hat-1 planlı bakımı var.',
    type: 'info' as const,
    timestamp: '1 saat önce'
  },
  {
    id: '3',
    title: 'Sistem Hatası',
    message: 'Tartı sistemi bağlantı hatası.',
    type: 'error' as const,
    timestamp: '2 saat önce'
  }
];

export default function DashboardPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filtreler değişti:', filters);
    // API çağrısı yapılacak ve veriler güncellenecek
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-2 font-bold text-gray-900">
            Genel Durum
          </h1>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-green-500 hover:bg-brand-green-600">
              Rapor Oluştur
            </button>
          </div>
        </div>

        {/* Bilgi Kartları */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            title="Günlük Atık Girişi"
            value="2,450 kg"
            change={5.25}
            icon={<ArrowDownTrayIcon className="h-6 w-6 text-brand-green-500" />}
            description="Son 24 saat"
          />
          <InfoCard
            title="İşlenen Malzeme"
            value="1,850 kg"
            change={3.2}
            icon={<CogIcon className="h-6 w-6 text-brand-blue-500" />}
            description="Son 24 saat"
          />
          <InfoCard
            title="Satışlar"
            value="₺45,250"
            change={-2.4}
            icon={<ShoppingCartIcon className="h-6 w-6 text-brand-green-700" />}
            description="Son 24 saat"
          />
          <InfoCard
            title="Kârlılık"
            value="%22.5"
            change={1.2}
            icon={<BanknotesIcon className="h-6 w-6 text-brand-blue-700" />}
            description="Son 30 gün"
          />
        </div>

        {/* Ana İçerik Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Performans Grafiği - 2 sütun */}
          <div className="lg:col-span-2">
            <PerformanceChart
              data={mockPerformanceData}
              title="Haftalık Performans"
            />
          </div>

          {/* Bildirimler - 1 sütun */}
          <div>
            <NotificationPanel
              notifications={notifications}
              onDismiss={handleDismissNotification}
            />
          </div>
        </div>

        {/* Dönüşüm İşlemleri */}
        <div>
          <OperationsList />
        </div>

        {/* Tesis Verimlilikleri */}
        <div>
          <FacilityEfficiency />
        </div>

        {/* Bekleyen İşlemler */}
        <div>
          <PendingTasks />
        </div>

        {/* Detaylı Veri Paneli */}
        <div>
          <DetailedDataPanel onFilterChange={handleFilterChange} />
        </div>
      </div>
    </DashboardLayout>
  );
} 