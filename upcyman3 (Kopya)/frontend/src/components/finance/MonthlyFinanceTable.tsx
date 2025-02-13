'use client';

import { useState } from 'react';
import { 
  PlusIcon, 
  XMarkIcon,
  FunnelIcon,
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';
import type { MonthlyFinanceDetail } from '@/app/dashboard/finance/page';

interface MonthlyFinanceTableProps {
  details: MonthlyFinanceDetail[];
  onSubmit: (data: Omit<MonthlyFinanceDetail, 'id'>) => void;
  onExport: () => void;
}

export default function MonthlyFinanceTable({
  details,
  onSubmit,
  onExport
}: MonthlyFinanceTableProps) {
  // Form ve Modal Durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingBalanceSheet, setIsGeneratingBalanceSheet] = useState(false);
  const [formData, setFormData] = useState<Omit<MonthlyFinanceDetail, 'id'>>({
    month: '',
    year: new Date().getFullYear(),
    category: 'sales',
    type: 'income',
    amount: 0,
    description: '',
    facility: ''
  });

  // Filtre Durumu
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    facility: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filtreleme Fonksiyonu
  const filteredDetails = details.filter(detail => {
    const date = `${detail.year}-${detail.month}`;
    const matchesDateRange = (!filters.startDate || date >= filters.startDate) &&
                           (!filters.endDate || date <= filters.endDate);
    const matchesType = filters.type === 'all' || detail.type === filters.type;
    const matchesFacility = filters.facility === 'all' || detail.facility === filters.facility;

    return matchesDateRange && matchesType && matchesFacility;
  });

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: 'all',
      facility: 'all'
    });
  };

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

  const getMonthName = (month: string) => {
    const months: { [key: string]: string } = {
      '01': 'Ocak',
      '02': 'Şubat',
      '03': 'Mart',
      '04': 'Nisan',
      '05': 'Mayıs',
      '06': 'Haziran',
      '07': 'Temmuz',
      '08': 'Ağustos',
      '09': 'Eylül',
      '10': 'Ekim',
      '11': 'Kasım',
      '12': 'Aralık'
    };
    return months[month] || month;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      month: '',
      year: new Date().getFullYear(),
      category: 'sales',
      type: 'income',
      amount: 0,
      description: '',
      facility: ''
    });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Başlık ve Butonlar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Aylık Finans Detayları
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
              Filtrele
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green-600 hover:bg-brand-green-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Yeni Kayıt
            </button>
            <button
              onClick={onExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
              Rapor İndir
            </button>
          </div>
        </div>

        {/* Filtre Paneli */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
                <input
                  type="month"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
                <input
                  type="month"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tür</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="income">Gelir</option>
                  <option value="expense">Gider</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tesis</label>
                <select
                  value={filters.facility}
                  onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                >
                  <option value="all">Tüm Tesisler</option>
                  <option value="Tesis 1">Tesis 1</option>
                  <option value="Tesis 2">Tesis 2</option>
                  <option value="Tesis 3">Tesis 3</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tür
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tesis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tutar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Açıklama
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDetails.map((detail) => (
              <tr key={detail.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getMonthName(detail.month)} {detail.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    detail.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {detail.type === 'income' ? 'Gelir' : 'Gider'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getCategoryText(detail.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {detail.facility}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={detail.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    ₺{detail.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {detail.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Yeni Kayıt Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Yeni Finans Kaydı
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ay</label>
                  <input
                    type="month"
                    required
                    value={`${formData.year}-${formData.month}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-');
                      setFormData({ ...formData, year: parseInt(year), month });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tür</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                  >
                    <option value="income">Gelir</option>
                    <option value="expense">Gider</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                >
                  <option value="">Seçiniz...</option>
                  <option value="sales">Satış</option>
                  <option value="utilities">Faturalar</option>
                  <option value="rent">Kira</option>
                  <option value="salary">Maaş</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tutar</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₺</span>
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tesis</label>
                <select
                  required
                  value={formData.facility}
                  onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                >
                  <option value="">Seçiniz...</option>
                  <option value="Tesis 1">Tesis 1</option>
                  <option value="Tesis 2">Tesis 2</option>
                  <option value="Tesis 3">Tesis 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-green-600 border border-transparent rounded-md hover:bg-brand-green-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 