'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { DateRange } from 'react-day-picker';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Chart.js kayıt işlemleri
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface SummaryData {
  title: string;
  value: string | number;
  description: string;
  trend?: 'up' | 'down';
  percentage?: number;
}

// Örnek veriler
const summaryCards: SummaryData[] = [
  {
    title: 'Toplam Gelir',
    value: '₺2,456,789',
    description: 'Son 30 günlük toplam gelir',
    trend: 'up',
    percentage: 12.5
  },
  {
    title: 'Toplam Gider',
    value: '₺1,234,567',
    description: 'Son 30 günlük toplam gider',
    trend: 'down',
    percentage: 5.2
  },
  {
    title: 'Net Kâr',
    value: '₺1,222,222',
    description: 'Son 30 günlük net kâr',
    trend: 'up',
    percentage: 18.3
  },
  {
    title: 'Ortalama Fire Oranı',
    value: '%2.5',
    description: 'Son 30 günlük ortalama fire oranı',
    trend: 'down',
    percentage: 1.1
  }
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [activeTab, setActiveTab] = useState('input-output');

  // Örnek grafik verileri
  const barChartData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Giriş',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Çıkış',
        data: [45, 49, 60, 71, 46, 45],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: ['İşçilik', 'Hammadde', 'Enerji', 'Bakım', 'Diğer'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
      },
    ],
  };

  const lineChartData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Kârlılık Oranı',
        data: [12, 19, 15, 17, 21, 18],
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.1,
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        {/* Başlık ve Tarih Seçici */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Raporlar
          </h1>
          <div className="flex items-center space-x-4">
            <DatePickerWithRange
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Dışa Aktar</span>
            </Button>
          </div>
        </div>

        {/* Özet Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                {card.trend && (
                  <svg
                    className={`h-4 w-4 ${
                      card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        card.trend === 'up'
                          ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                          : 'M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6'
                      }
                    />
                  </svg>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                  {card.percentage && (
                    <span className={`ml-2 ${
                      card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {card.trend === 'up' ? '+' : '-'}{card.percentage}%
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ana İçerik */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="input-output">Girdi-Çıktı Denge</TabsTrigger>
            <TabsTrigger value="purchase-sale">Alım-Satım</TabsTrigger>
            <TabsTrigger value="stock">Stok</TabsTrigger>
            <TabsTrigger value="facility-cost">Tesis Maliyet</TabsTrigger>
            <TabsTrigger value="profitability">Kârlılık Analizi</TabsTrigger>
          </TabsList>

          {/* Girdi-Çıktı Denge Raporu */}
          <TabsContent value="input-output" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Girdi-Çıktı Dengesi</CardTitle>
                  <CardDescription>Malzeme bazında giriş-çıkış miktarları</CardDescription>
                </CardHeader>
                <CardContent>
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fire Analizi</CardTitle>
                  <CardDescription>Malzeme bazında fire oranları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Öneriler</CardTitle>
                <CardDescription>Fire oranı yüksek malzemeler için öneriler</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>A malzemesi için üretim sürecinin optimize edilmesi önerilir.</li>
                  <li>B malzemesi için kalite kontrol süreçlerinin gözden geçirilmesi önerilir.</li>
                  <li>C malzemesi için depolama koşullarının iyileştirilmesi önerilir.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alım-Satım Raporu */}
          <TabsContent value="purchase-sale" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alım-Satım Dengesi</CardTitle>
                  <CardDescription>Dönemsel alım-satım karşılaştırması</CardDescription>
                </CardHeader>
                <CardContent>
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Müşteri Dağılımı</CardTitle>
                  <CardDescription>Satışların müşterilere göre dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stok Raporu */}
          <TabsContent value="stock" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stok Seviyesi Değişimi</CardTitle>
                  <CardDescription>Zaman içinde stok seviyesi değişimi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kritik Stok Seviyeleri</CardTitle>
                  <CardDescription>Minimum stok seviyesine yaklaşan ürünler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Kritik stok uyarıları burada listelenecek */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tesis Maliyet Raporu */}
          <TabsContent value="facility-cost" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maliyet Dağılımı</CardTitle>
                  <CardDescription>Maliyet kalemlerinin dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tesis Karşılaştırma</CardTitle>
                  <CardDescription>Tesisler arası maliyet karşılaştırması</CardDescription>
                </CardHeader>
                <CardContent>
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Kârlılık Analizi Raporu */}
          <TabsContent value="profitability" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Kârlılık Trendi</CardTitle>
                  <CardDescription>Dönemsel kârlılık değişimi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ürün Kârlılığı</CardTitle>
                  <CardDescription>Ürün bazında kârlılık analizi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 