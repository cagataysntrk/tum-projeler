'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ProfitabilityData } from '@/app/dashboard/finance/page';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProfitabilityPanelProps {
  data: ProfitabilityData[];
  onExport: () => void;
}

export default function ProfitabilityPanel({
  data,
  onExport
}: ProfitabilityPanelProps) {
  // En son dönem verilerini al
  const latestData = data[data.length - 1];

  // Grafik verilerini hazırla
  const chartData = {
    labels: data.map(item => item.period),
    datasets: [
      {
        label: 'Brüt Kâr',
        data: data.map(item => item.grossProfit),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Net Kâr',
        data: data.map(item => item.netProfit),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `₺${value.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Kârlılık Analizi
          </h2>
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
            Rapor İndir
          </button>
        </div>

        {/* Özet Paneller */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Toplam Gelir</div>
            <div className="mt-1 text-xl font-semibold text-gray-900">
              ₺{latestData.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Toplam Maliyet</div>
            <div className="mt-1 text-xl font-semibold text-gray-900">
              ₺{latestData.totalCosts.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Net Kâr</div>
            <div className="mt-1 text-xl font-semibold text-green-600">
              ₺{latestData.netProfit.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Kâr Marjı</div>
            <div className="mt-1 text-xl font-semibold text-blue-600">
              %{latestData.profitMargin.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Grafik */}
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
} 