'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import type { StockItem } from '@/app/dashboard/inventory/page';

interface InventoryTableProps {
  stocks: StockItem[];
  filters: {
    facility: string;
    materialType: string;
    status: string;
  };
  onFilterChange: (filters: { facility: string; materialType: string; status: string }) => void;
  onAdjustStock: (stock: StockItem) => void;
}

export default function InventoryTable({
  stocks,
  filters,
  onFilterChange,
  onAdjustStock
}: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Stok durumuna göre renk sınıfları
  const getStatusColor = (status: StockItem['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Malzeme türünü Türkçe'ye çevir
  const getMaterialTypeText = (type: string) => {
    switch (type) {
      case 'plastic':
        return 'Plastik';
      case 'paper':
        return 'Kağıt';
      case 'metal':
        return 'Metal';
      case 'glass':
        return 'Cam';
      default:
        return type;
    }
  };

  // Stok durumunu Türkçe'ye çevir
  const getStatusText = (status: StockItem['status']) => {
    switch (status) {
      case 'critical':
        return 'Kritik';
      case 'warning':
        return 'Uyarı';
      case 'normal':
        return 'Normal';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Filtreler ve Arama */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Arama */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Malzeme ara..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Tesis Filtresi */}
          <div>
            <select
              value={filters.facility}
              onChange={(e) => onFilterChange({ ...filters, facility: e.target.value })}
              className="w-full border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              <option value="">Tüm Tesisler</option>
              <option value="Tesis 1">Tesis 1</option>
              <option value="Tesis 2">Tesis 2</option>
            </select>
          </div>

          {/* Malzeme Türü Filtresi */}
          <div>
            <select
              value={filters.materialType}
              onChange={(e) => onFilterChange({ ...filters, materialType: e.target.value })}
              className="w-full border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              <option value="">Tüm Malzemeler</option>
              <option value="plastic">Plastik</option>
              <option value="paper">Kağıt</option>
              <option value="metal">Metal</option>
              <option value="glass">Cam</option>
            </select>
          </div>

          {/* Durum Filtresi */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="w-full border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="normal">Normal</option>
              <option value="warning">Uyarı</option>
              <option value="critical">Kritik</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Malzeme
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tesis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mevcut Miktar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Güncelleme
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {stock.materialName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getMaterialTypeText(stock.materialType)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.facility}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {stock.currentAmount} {stock.unit}
                  </div>
                  <div className="text-xs text-gray-500">
                    Min: {stock.minThreshold} / Max: {stock.maxThreshold}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.lastUpdate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(stock.status)}`}>
                    {getStatusText(stock.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onAdjustStock(stock)}
                    className="text-brand-blue-600 hover:text-brand-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 