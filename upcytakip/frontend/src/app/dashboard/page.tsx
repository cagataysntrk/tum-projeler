'use client';

import MainLayout from '@/components/layout/MainLayout';
import ProfileCard from '@/components/dashboard/ProfileCard';
import PriceTable from '@/components/dashboard/PriceTable';
import PriceHistory from '@/components/dashboard/PriceHistory';
import PriceCharts from '@/components/dashboard/PriceCharts';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profil Kartı */}
        <div className="grid grid-cols-1 gap-4">
          <ProfileCard />
        </div>

        {/* Güncel Fiyat Listesi */}
        <PriceTable />

        {/* Geçmiş Fiyat Verileri */}
        <PriceHistory />

        {/* Fiyat Analiz Grafikleri */}
        <PriceCharts />
      </div>
    </MainLayout>
  );
} 