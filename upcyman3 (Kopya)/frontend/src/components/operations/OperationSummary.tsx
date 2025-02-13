'use client';

import { 
  ClockIcon,
  ScaleIcon,
  CheckBadgeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import type { Machine, OperationData } from '@/app/dashboard/operations/page';

interface OperationSummaryProps {
  operation: OperationData | null;
  machines: Machine[];
}

export default function OperationSummary({ operation, machines }: OperationSummaryProps) {
  const getMachineName = (id: string) => {
    return machines.find(m => m.id === id)?.name || 'Bilinmeyen Makine';
  };

  const getOperationTypeName = (type: string) => {
    switch (type) {
      case 'sorting':
        return 'Malzeme Ayırma';
      case 'compression':
        return 'Sıkıştırma';
      case 'recycling':
        return 'Geri Dönüşüm';
      case 'cleaning':
        return 'Temizleme';
      case 'shredding':
        return 'Parçalama';
      default:
        return type;
    }
  };

  const calculateEfficiency = () => {
    if (!operation) return 0;
    return ((operation.outputAmount / operation.inputAmount) * 100).toFixed(1);
  };

  if (!operation) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Operasyon Özeti
        </h2>
        <div className="text-center text-gray-500 py-8">
          Aktif operasyon bulunmuyor
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-medium text-gray-900">
        Operasyon Özeti
      </h2>

      {/* Temel Bilgiler */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">İşlem Türü</span>
          <span className="text-sm font-medium text-gray-900">
            {getOperationTypeName(operation.type)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Makine</span>
          <span className="text-sm font-medium text-gray-900">
            {getMachineName(operation.machineId)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Başlangıç</span>
          <span className="text-sm font-medium text-gray-900">
            {new Date(operation.startTime).toLocaleString('tr-TR')}
          </span>
        </div>
      </div>

      {/* Metrikler */}
      <div className="grid grid-cols-2 gap-4">
        {/* Süre */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Süre</span>
          </div>
          <div className="mt-1 text-xl font-semibold text-gray-900">
            {operation.duration} dk
          </div>
        </div>

        {/* Verimlilik */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckBadgeIcon className="h-5 w-5 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Verimlilik</span>
          </div>
          <div className="mt-1 text-xl font-semibold text-gray-900">
            %{calculateEfficiency()}
          </div>
        </div>
      </div>

      {/* Miktar Bilgileri */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            <ScaleIcon className="h-5 w-5 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Giriş/Çıkış Miktarı</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Giriş</span>
              <span className="text-sm font-medium text-gray-900">
                {operation.inputAmount} kg
              </span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">Çıkış</span>
              <span className="text-sm font-medium text-gray-900">
                {operation.outputAmount} kg
              </span>
            </div>
          </div>
        </div>

        {/* Kalite */}
        <div>
          <div className="flex items-center mb-2">
            <CheckBadgeIcon className="h-5 w-5 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Kalite Seviyesi</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-center">
              <span className={`text-2xl font-bold ${
                operation.qualityLevel === 'A' ? 'text-green-600' :
                operation.qualityLevel === 'B' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {operation.qualityLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Notlar */}
        {operation.operatorNotes && (
          <div>
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Operatör Notları</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {operation.operatorNotes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 