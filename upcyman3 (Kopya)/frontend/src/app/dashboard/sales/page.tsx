'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SalesForm from '@/components/sales/SalesForm';
import SalesSummary from '@/components/sales/SalesSummary';

export interface Customer {
  id: string;
  name: string;
  type: 'individual' | 'company';
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  stockAmount: number;
  unit: string;
  unitPrice: number;
}

export interface Sale {
  id: string;
  customerId: string;
  products: {
    productId: string;
    amount: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  deliveryDate: string;
  deliveryMethod: string;
  deliveryNotes?: string;
  trackingNumber?: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

// Örnek müşteri verileri
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Yeşil Plastik Ltd. Şti.',
    type: 'company',
    phone: '0212 555 0001',
    email: 'info@yesilplastik.com',
    address: 'İstanbul, Türkiye',
    taxNumber: '1234567890',
    taxOffice: 'Beşiktaş'
  },
  {
    id: '2',
    name: 'Mehmet Yılmaz',
    type: 'individual',
    phone: '0533 555 0002',
    email: 'mehmet@email.com',
    address: 'Ankara, Türkiye'
  }
];

// Örnek ürün verileri
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Geri Dönüştürülmüş PET Granül',
    type: 'plastic',
    stockAmount: 5000,
    unit: 'kg',
    unitPrice: 15.5
  },
  {
    id: '2',
    name: 'Preslenmiş Kağıt Balyası',
    type: 'paper',
    stockAmount: 8000,
    unit: 'kg',
    unitPrice: 8.75
  },
  {
    id: '3',
    name: 'Metal Hurda (Karışık)',
    type: 'metal',
    stockAmount: 3000,
    unit: 'kg',
    unitPrice: 22.0
  }
];

export default function SalesPage() {
  const [activeSale, setActiveSale] = useState<Sale | null>(null);

  const handleSaleSubmit = async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    // API'ye gönderilecek
    console.log('Yeni satış:', saleData);
    
    // Başarılı mesajı göster
    alert('Satış başarıyla kaydedildi.');
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-2 font-bold text-gray-900">
            Satış İşlemleri
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Form */}
          <div className="lg:col-span-2">
            <SalesForm 
              customers={mockCustomers}
              products={mockProducts}
              onSubmit={handleSaleSubmit}
            />
          </div>

          {/* Sağ Taraf - Özet */}
          <div>
            <SalesSummary 
              sale={activeSale}
              customers={mockCustomers}
              products={mockProducts}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 