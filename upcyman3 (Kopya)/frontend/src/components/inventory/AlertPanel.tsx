'use client';

import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import type { StockItem } from '@/app/dashboard/inventory/page';

interface AlertPanelProps {
  stocks: StockItem[];
}

export default function AlertPanel({ stocks }: AlertPanelProps) {
  // Stok durumlarına göre grupla
  const criticalStocks = stocks.filter(stock => stock.status === 'critical');
  const warningStocks = stocks.filter(stock => stock.status === 'warning');
  const normalStocks = stocks.filter(stock => stock.status === 'normal');

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Kritik Stoklar */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">
              Kritik Stoklar
            </h3>
            <p className="text-sm text-red-600">
              {criticalStocks.length} malzeme kritik seviyede
            </p>
          </div>
        </div>

        {criticalStocks.length > 0 && (
          <div className="mt-4 space-y-3">
            {criticalStocks.map(stock => (
              <div
                key={stock.id}
                className="bg-white rounded-md p-3 border border-red-200"
              >
                <div className="font-medium text-red-900">
                  {stock.materialName}
                </div>
                <div className="text-sm text-red-600">
                  {getMaterialTypeText(stock.materialType)} • {stock.facility}
                </div>
                <div className="text-sm text-red-800 mt-1">
                  Mevcut: {stock.currentAmount} {stock.unit} (Min: {stock.minThreshold})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uyarı Durumundaki Stoklar */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800">
              Uyarı Durumundaki Stoklar
            </h3>
            <p className="text-sm text-yellow-600">
              {warningStocks.length} malzeme uyarı seviyesinde
            </p>
          </div>
        </div>

        {warningStocks.length > 0 && (
          <div className="mt-4 space-y-3">
            {warningStocks.map(stock => (
              <div
                key={stock.id}
                className="bg-white rounded-md p-3 border border-yellow-200"
              >
                <div className="font-medium text-yellow-900">
                  {stock.materialName}
                </div>
                <div className="text-sm text-yellow-600">
                  {getMaterialTypeText(stock.materialType)} • {stock.facility}
                </div>
                <div className="text-sm text-yellow-800 mt-1">
                  Mevcut: {stock.currentAmount} {stock.unit} (Min: {stock.minThreshold})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Normal Stoklar */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">
              Normal Stoklar
            </h3>
            <p className="text-sm text-green-600">
              {normalStocks.length} malzeme normal seviyede
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="bg-white rounded-md p-3 border border-green-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
              <div>
                <span className="font-medium">Toplam Malzeme:</span>
                <br />
                {stocks.length} çeşit
              </div>
              <div>
                <span className="font-medium">Normal Stok Oranı:</span>
                <br />
                {((normalStocks.length / stocks.length) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 