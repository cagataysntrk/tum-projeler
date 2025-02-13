'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { FinancialEntry } from '@/app/dashboard/finance/page';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IncomeExpenseProps {
  entries: FinancialEntry[];
  onSubmit: (data: Omit<FinancialEntry, 'id'>) => void;
  onExport: () => void;
}

export default function IncomeExpense({
  entries,
  onSubmit,
  onExport
}: IncomeExpenseProps) {
  const [formData, setFormData] = useState<Omit<FinancialEntry, 'id'>>({
    type: 'income',
    category: 'sales',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    facility: 'Tesis 1'
  });

  // Kategori türünü Türkçe'ye çevir
  const getCategoryText = (category: string) => {
    switch (category) {
      case 'sales':
        return 'Satış';
      case 'utilities':
        return 'Faturalar';
      case 'rent':
        return 'Kira';
      case 'salary':
        return 'Maaş';
      case 'other':
        return 'Diğer';
      default:
        return category;
    }
  };

  // Gelir ve giderleri hesapla
  const totals = entries.reduce(
    (acc, entry) => {
      if (entry.type === 'income') {
        acc.income += entry.amount;
      } else {
        acc.expense += entry.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  // Grafik verilerini hazırla
  const chartData = {
    labels: ['Gelir/Gider Analizi'],
    datasets: [
      {
        label: 'Gelir',
        data: [totals.income],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Gider',
        data: [totals.expense],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Formu sıfırla
    setFormData({
      type: 'income',
      category: 'sales',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      facility: 'Tesis 1'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Gelir/Gider Yönetimi
          </h2>
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
            Rapor İndir
          </button>
        </div>

        {/* Özet Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Toplam Gelir</div>
            <div className="mt-1 text-xl font-semibold text-green-600">
              ₺{totals.income.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Toplam Gider</div>
            <div className="mt-1 text-xl font-semibold text-red-600">
              ₺{totals.expense.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Net Durum</div>
            <div className={`mt-1 text-xl font-semibold ${
              totals.income - totals.expense >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ₺{(totals.income - totals.expense).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tür
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500"
            >
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500"
            >
              <option value="sales">Satış</option>
              <option value="utilities">Faturalar</option>
              <option value="rent">Kira</option>
              <option value="salary">Maaş</option>
              <option value="other">Diğer</option>
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
              {formData.type === 'income' ? 'Gelir' : 'Gider'} Ekle
            </button>
          </div>
        </form>

        {/* Grafik */}
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
} 