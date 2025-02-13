'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WasteEntryForm from '@/components/waste-entry/WasteEntryForm';
import StockStatus from '@/components/waste-entry/StockStatus';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import Modal from '@/components/Modal';

// Örnek stok verileri
const mockStocks = [
  {
    materialType: 'Kağıt',
    currentAmount: 12500,
    capacity: 20000,
    lastUpdate: '2024-02-11 15:30'
  },
  {
    materialType: 'Plastik',
    currentAmount: 8750,
    capacity: 15000,
    lastUpdate: '2024-02-11 14:45'
  },
  {
    materialType: 'Metal',
    currentAmount: 5200,
    capacity: 10000,
    lastUpdate: '2024-02-11 13:15'
  },
  {
    materialType: 'Cam',
    currentAmount: 6800,
    capacity: 12000,
    lastUpdate: '2024-02-11 12:00'
  }
];

interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxNumber?: string;
  contactPerson?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Örnek tedarikçi verileri
const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'ABC Geri Dönüşüm Ltd. Şti.',
    address: 'Organize Sanayi Bölgesi 1. Cadde No:123 Ankara',
    phone: '0312 555 44 33',
    email: 'info@abcgeridonusum.com',
    taxNumber: '1234567890',
    contactPerson: 'Ahmet Yılmaz',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Yeşil Çevre Atık Yönetimi',
    address: 'İstanbul Yolu 25. km No:45 Ankara',
    phone: '0312 444 55 66',
    email: 'iletisim@yesilcevre.com',
    taxNumber: '9876543210',
    contactPerson: 'Ayşe Demir',
    createdAt: '2024-01-20T14:20:00Z'
  },
  {
    id: 3,
    name: 'Doğa Atık Toplama ve Geri Kazanım',
    address: 'Sincan OSB 15. Sokak No:78 Ankara',
    phone: '0312 333 22 11',
    email: 'bilgi@dogaatik.com',
    taxNumber: '4567891230',
    contactPerson: 'Mehmet Kaya',
    createdAt: '2024-02-01T09:15:00Z'
  }
];

export default function WasteEntryPage() {
  const [newEntry, setNewEntry] = useState<{
    materialType: string;
    amount: number;
  } | undefined>(undefined);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [newSupplier, setNewSupplier] = useState('');
  const [showSuppliersList, setShowSuppliersList] = useState(false);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState<Partial<Supplier>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    taxNumber: '',
    contactPerson: '',
    notes: ''
  });

  const handleWasteEntry = async (data: any) => {
    // Yeni girişi stok göstergesinde göster
    setNewEntry({
      materialType: data.materialType === 'paper' ? 'Kağıt' :
                   data.materialType === 'plastic' ? 'Plastik' :
                   data.materialType === 'metal' ? 'Metal' :
                   'Cam',
      amount: data.weight
    });

    // API'ye gönder
    try {
      // const response = await fetch('/api/waste-entries', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      console.log('Atık girişi kaydedildi:', data);
      
      // Başarılı mesajı göster
      alert('Atık girişi başarıyla kaydedildi.');
      
      // 3 saniye sonra yeni giriş göstergesini kaldır
      setTimeout(() => {
        setNewEntry(undefined);
      }, 3000);
    } catch (error) {
      console.error('Atık girişi kaydedilirken hata oluştu:', error);
      alert('Atık girişi kaydedilirken bir hata oluştu.');
    }
  };

  const handleAddSupplier = () => {
    if (!supplierForm.name?.trim()) return;

    const supplier: Supplier = {
      id: suppliers.length + 1,
      name: supplierForm.name.trim(),
      address: supplierForm.address || '',
      phone: supplierForm.phone || '',
      email: supplierForm.email || '',
      taxNumber: supplierForm.taxNumber,
      contactPerson: supplierForm.contactPerson,
      notes: supplierForm.notes,
      createdAt: new Date().toISOString(),
    };

    setSuppliers([...suppliers, supplier]);
    setSupplierForm({
      name: '',
      address: '',
      phone: '',
      email: '',
      taxNumber: '',
      contactPerson: '',
      notes: ''
    });
    setIsAddSupplierModalOpen(false);
  };

  const handleSelectSupplier = (supplier: Supplier) => {
    setNewSupplier(supplier.name);
    setShowSuppliersList(false);
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Atık Kabul
          </h1>
          <button
            type="button"
            onClick={() => setIsAddSupplierModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2 -ml-1" aria-hidden="true" />
            Tedarikçi Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="mb-6">
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                  Tedarikçi Seçin
                </label>
                <select
                  id="supplier"
                  value={selectedSupplier?.id || ''}
                  onChange={(e) => {
                    const supplier = suppliers.find(s => s.id === Number(e.target.value));
                    setSelectedSupplier(supplier || null);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Tedarikçi seçin...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {selectedSupplier && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>{selectedSupplier.address}</p>
                    <p>İletişim: {selectedSupplier.contactPerson} - {selectedSupplier.phone}</p>
                  </div>
                )}
              </div>
            </div>
            <WasteEntryForm onSubmit={handleWasteEntry} />
          </div>

          {/* Sağ Taraf - Stok Durumu */}
          <div>
            <StockStatus stocks={mockStocks} newEntry={newEntry} />
          </div>
        </div>

        {/* Tedarikçi Modal */}
        <Modal
          isOpen={isAddSupplierModalOpen}
          onClose={() => setIsAddSupplierModalOpen(false)}
          title="Yeni Tedarikçi Ekle"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="supplier-name" className="block text-sm font-medium text-gray-700">
                Tedarikçi Adı *
              </label>
              <input
                type="text"
                id="supplier-name"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="supplier-address" className="block text-sm font-medium text-gray-700">
                Adres
              </label>
              <textarea
                id="supplier-address"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="supplier-phone" className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="supplier-phone"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="supplier-email" className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <input
                  type="email"
                  id="supplier-email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="supplier-tax" className="block text-sm font-medium text-gray-700">
                  Vergi Numarası
                </label>
                <input
                  type="text"
                  id="supplier-tax"
                  value={supplierForm.taxNumber}
                  onChange={(e) => setSupplierForm({ ...supplierForm, taxNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="supplier-contact" className="block text-sm font-medium text-gray-700">
                  İletişim Kişisi
                </label>
                <input
                  type="text"
                  id="supplier-contact"
                  value={supplierForm.contactPerson}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="supplier-notes" className="block text-sm font-medium text-gray-700">
                Notlar
              </label>
              <textarea
                id="supplier-notes"
                value={supplierForm.notes}
                onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                onClick={handleAddSupplier}
              >
                Kaydet
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                onClick={() => setIsAddSupplierModalOpen(false)}
              >
                İptal
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
} 