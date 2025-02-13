'use client';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import type { StockHistory } from '@/app/dashboard/inventory/page';

interface StockHistoryProps {
  history: StockHistory[];
  filters: {
    timeRange: string;
    facility: string;
    materialType: string;
    source: string;
  };
  onFilterChange: (filters: { timeRange: string; facility: string; materialType: string; source: string }) => void;
  onExport: () => void;
}

export default function StockHistory({
  history,
  filters,
  onFilterChange,
  onExport
}: StockHistoryProps) {
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

  // Kaynak türünü Türkçe'ye çevir
  const getSourceText = (source: StockHistory['source']) => {
    switch (source) {
      case 'waste_entry':
        return 'Atık Kabul';
      case 'operation':
        return 'Operasyon';
      case 'sale':
        return 'Satış';
      case 'adjustment':
        return 'Manuel Düzeltme';
      default:
        return source;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Başlık ve Dışa Aktarma */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Stok Değişiklik Geçmişi
          </h2>
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
            Rapor İndir
          </button>
        </div>

        {/* Filtreler */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Zaman Aralığı */}
          <div>
            <select
              value={filters.timeRange}
              onChange={(e) => onFilterChange({ ...filters, timeRange: e.target.value })}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              <option value="hourly">Saatlik</option>
              <option value="daily">Günlük</option>
              <option value="weekly">Haftalık</option>
              <option value="monthly">Aylık</option>
            </select>
          </div>

          {/* Tesis Filtresi */}
          <div>
            <select
              value={filters.facility}
              onChange={(e) => onFilterChange({ ...filters, facility: e.target.value })}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
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
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              <option value="">Tüm Malzemeler</option>
              <option value="plastic">Plastik</option>
              <option value="paper">Kağıt</option>
              <option value="metal">Metal</option>
              <option value="glass">Cam</option>
            </select>
          </div>

          {/* Kaynak Filtresi */}
          <div>
            <select
              value={filters.source}
              onChange={(e) => onFilterChange({ ...filters, source: e.target.value })}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              <option value="">Tüm Kaynaklar</option>
              <option value="waste_entry">Atık Kabul</option>
              <option value="operation">Operasyon</option>
              <option value="sale">Satış</option>
              <option value="adjustment">Manuel Düzeltme</option>
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
                Tarih/Saat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Malzeme
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tesis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Değişim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Miktar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kaynak
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notlar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.materialName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getMaterialTypeText(item.materialType)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.facility}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.changeType === 'increase' ? (
                      <ArrowUpIcon className="h-5 w-5 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-5 w-5 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.changeType === 'increase' ? '+' : '-'}{item.amount} {item.unit}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.previousAmount} → {item.newAmount} {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.amount} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getSourceText(item.source)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 