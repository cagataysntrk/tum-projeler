'use client';

import { useState } from 'react';

interface DataPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  facility: string;
  employee: string;
  dateRange: string;
  category: string;
}

const facilities = ['Tüm Tesisler', 'Tesis 1', 'Tesis 2', 'Tesis 3'];
const categories = ['Tüm Kategoriler', 'Atık Kabul', 'İşleme', 'Satış', 'Stok', 'Finans', 'Bakım', 'Personel'];
const dateRanges = ['Bugün', 'Bu Hafta', 'Bu Ay', 'Son 3 Ay', 'Özel'];

export default function DetailedDataPanel({ onFilterChange }: DataPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    facility: 'Tüm Tesisler',
    employee: '',
    dateRange: 'Bu Hafta',
    category: 'Tüm Kategoriler'
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Detaylı Veri Görünümü
      </h2>

      <div className="space-y-4">
        {/* Filtreler */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tesis Seçimi */}
          <div>
            <label htmlFor="facility" className="block text-sm font-medium text-gray-700">
              Tesis
            </label>
            <select
              id="facility"
              value={filters.facility}
              onChange={(e) => handleFilterChange('facility', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
            >
              {facilities.map((facility) => (
                <option key={facility} value={facility}>
                  {facility}
                </option>
              ))}
            </select>
          </div>

          {/* Personel Arama */}
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
              Personel
            </label>
            <input
              type="text"
              id="employee"
              value={filters.employee}
              onChange={(e) => handleFilterChange('employee', e.target.value)}
              placeholder="İsim ile ara..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
            />
          </div>

          {/* Tarih Aralığı */}
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
              Tarih Aralığı
            </label>
            <select
              id="dateRange"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
            >
              {dateRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Veri Görünümü */}
        <div className="mt-6">
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seçilen filtrelere göre veriler burada görüntülenecek
              </div>
              <div className="bg-white px-6 py-4 text-sm text-gray-500">
                Lütfen görüntülemek istediğiniz verileri filtreleyiniz
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 