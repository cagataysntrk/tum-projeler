'use client';

import { useState } from 'react';

interface Operation {
  id: string;
  name: string;
  type: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  efficiency: number;
  inputAmount: number;
  outputAmount: number;
  facility: string;
}

const mockOperations: Operation[] = [
  {
    id: '1',
    name: 'PET Şişe Dönüşümü',
    type: 'Plastik İşleme',
    status: 'in_progress',
    startDate: '2024-02-11 09:00',
    efficiency: 85,
    inputAmount: 1000,
    outputAmount: 850,
    facility: 'Tesis 1'
  },
  {
    id: '2',
    name: 'Cam Kırma',
    type: 'Cam İşleme',
    status: 'waiting',
    startDate: '2024-02-12 10:00',
    efficiency: 0,
    inputAmount: 1500,
    outputAmount: 0,
    facility: 'Tesis 2'
  },
  {
    id: '3',
    name: 'Kağıt Hamuru',
    type: 'Kağıt İşleme',
    status: 'completed',
    startDate: '2024-02-10 08:00',
    endDate: '2024-02-10 16:00',
    efficiency: 92,
    inputAmount: 2000,
    outputAmount: 1840,
    facility: 'Tesis 1'
  }
];

const timeRanges = [
  { id: 'daily', name: 'Günlük' },
  { id: 'weekly', name: 'Haftalık' },
  { id: 'monthly', name: 'Aylık' }
];

export default function OperationsList() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('daily');

  const getStatusBadgeColor = (status: Operation['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Operation['status']) => {
    switch (status) {
      case 'waiting':
        return 'Bekliyor';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Dönüşüm İşlemleri
        </h2>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setSelectedTimeRange(range.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedTimeRange === range.id
                  ? 'bg-brand-green-100 text-brand-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range.name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tesis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlangıç
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verimlilik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giriş/Çıkış (kg)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockOperations.map((operation) => (
              <tr key={operation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {operation.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {operation.type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {operation.facility}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(operation.status)}`}>
                    {getStatusText(operation.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {operation.startDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900">
                      {operation.efficiency}%
                    </div>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brand-green-500 rounded-full h-2"
                        style={{ width: `${operation.efficiency}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {operation.inputAmount} / {operation.outputAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 