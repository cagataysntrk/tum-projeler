'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import type { CostData, CostType } from '@/app/dashboard/finance/page';

// Chart.js bileşenlerini kaydet
ChartJS.register(ArcElement, Tooltip, Legend);

interface CostAnalysisProps {
  costs: CostData[];
  onSubmit: (data: Omit<CostData, 'id'>) => void;
  onExport: () => void;
}

export default function CostAnalysis({
  costs,
  onSubmit,
  onExport
}: CostAnalysisProps) {
  const [formData, setFormData] = useState<Omit<CostData, 'id'>>({
    type: 'waste',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    facility: 'Tesis 1',
    category: 'input'
  });

  // Maliyet türünü Türkçe'ye çevir
  const getCostTypeText = (type: CostType) => {
    switch (type) {
      case 'waste':
        return 'Atık';
      case 'processing':
        return 'İşleme';
      case 'labor':
        return 'İşçilik';
      case 'energy':
        return 'Enerji';
      case 'maintenance':
        return 'Bakım';
      case 'other':
        return 'Diğer';
      default:
        return type;
    }
  };

  // Maliyet türlerine göre toplam hesapla
  const costsByType = costs.reduce((acc, cost) => {
    acc[cost.type] = (acc[cost.type] || 0) + cost.amount;
    return acc;
  }, {} as Record<CostType, number>);

  // Grafik verilerini hazırla
  const chartData = {
    labels: Object.keys(costsByType).map(type => getCostTypeText(type as CostType)),
    datasets: [
      {
        data: Object.values(costsByType),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Formu sıfırla
    setFormData({
      type: 'waste',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      facility: 'Tesis 1',
      category: 'input'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Maliyet Analizi
          </h2>
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
            Rapor İndir
          </button>
        </div>

        {/* Maliyet Giriş Formu */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maliyet Türü
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as CostType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500"
            >
              <option value="waste">Atık</option>
              <option value="processing">İşleme</option>
              <option value="labor">İşçilik</option>
              <option value="energy">Enerji</option>
              <option value="maintenance">Bakım</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'input' | 'output' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500"
            >
              <option value="input">Girdi</option>
              <option value="output">Çıktı</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Miktar (₺)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tesis
            </label>
            <select
              value={formData.facility}
              onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500"
            >
              <option value="Tesis 1">Tesis 1</option>
              <option value="Tesis 2">Tesis 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tarih
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500"
              placeholder="Opsiyonel açıklama"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
            >
              Maliyet Ekle
            </button>
          </div>
        </form>

        {/* Grafik */}
        <div className="h-64">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
} 