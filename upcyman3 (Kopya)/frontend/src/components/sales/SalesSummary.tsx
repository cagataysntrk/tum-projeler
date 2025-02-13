'use client';

import { 
  UserIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import type { Customer, Product, Sale } from '@/app/dashboard/sales/page';

interface SalesSummaryProps {
  sale: Sale | null;
  customers: Customer[];
  products: Product[];
}

export default function SalesSummary({ sale, customers, products }: SalesSummaryProps) {
  const getCustomerName = (id: string) => {
    return customers.find(c => c.id === id)?.name || 'Bilinmeyen Müşteri';
  };

  const getProductName = (id: string) => {
    return products.find(p => p.id === id)?.name || 'Bilinmeyen Ürün';
  };

  const getDeliveryMethodText = (method: string) => {
    switch (method) {
      case 'company':
        return 'Şirket Aracı';
      case 'customer':
        return 'Müşteri Alımı';
      case 'cargo':
        return 'Kargo';
      default:
        return method;
    }
  };

  if (!sale) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Satış Özeti
        </h2>
        <div className="text-center text-gray-500 py-8">
          Aktif satış işlemi bulunmuyor
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Satış Özeti
        </h2>

        {/* Müşteri Bilgileri */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <UserIcon className="h-5 w-5 mr-2" />
            Müşteri Bilgileri
          </div>
          <div className="font-medium text-gray-900">
            {getCustomerName(sale.customerId)}
          </div>
        </div>

        {/* Ürün Listesi */}
        <div className="space-y-3">
          {sale.products.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {getProductName(item.productId)}
                </div>
                <div className="text-gray-500">
                  {item.amount} x ₺{item.unitPrice.toFixed(2)}
                </div>
              </div>
              <div className="font-medium text-gray-900">
                ₺{item.totalPrice.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Toplam Tutar */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-base font-medium text-gray-500">
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              Toplam Tutar
            </div>
            <div className="text-lg font-bold text-gray-900">
              ₺{sale.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Teslimat Bilgileri */}
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <TruckIcon className="h-5 w-5 mr-2" />
              Teslimat Yöntemi
            </div>
            <div className="font-medium text-gray-900">
              {getDeliveryMethodText(sale.deliveryMethod)}
            </div>
          </div>

          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <ClockIcon className="h-5 w-5 mr-2" />
              Teslimat Tarihi
            </div>
            <div className="font-medium text-gray-900">
              {new Date(sale.deliveryDate).toLocaleDateString('tr-TR')}
            </div>
          </div>

          {sale.trackingNumber && (
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Takip Numarası
              </div>
              <div className="font-medium text-gray-900">
                {sale.trackingNumber}
              </div>
            </div>
          )}

          {sale.deliveryNotes && (
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Teslimat Notları
              </div>
              <div className="text-gray-700 whitespace-pre-wrap">
                {sale.deliveryNotes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Durum */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Durum</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            sale.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
            sale.status === 'delivered' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {sale.status === 'pending' ? 'Beklemede' :
             sale.status === 'confirmed' ? 'Onaylandı' :
             sale.status === 'delivered' ? 'Teslim Edildi' :
             'İptal Edildi'}
          </span>
        </div>
      </div>
    </div>
  );
} 