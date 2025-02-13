'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Supplier {
  id: string;
  name: string;
  type: 'individual' | 'company';
  phone?: string;
  email?: string;
  address?: string;
}

interface SupplierSearchProps {
  onSelect: (supplier: Supplier) => void;
  onAdd: (supplier: Omit<Supplier, 'id'>) => void;
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Yeşil Geri Dönüşüm Ltd. Şti.',
    type: 'company',
    phone: '0212 555 0001',
    email: 'info@yesildonusum.com',
    address: 'İstanbul, Türkiye'
  },
  {
    id: '2',
    name: 'Ahmet Yılmaz',
    type: 'individual',
    phone: '0533 555 0002',
    email: 'ahmet@email.com'
  },
  {
    id: '3',
    name: 'Çevre Dostu A.Ş.',
    type: 'company',
    phone: '0216 555 0003',
    email: 'iletisim@cevredostu.com',
    address: 'İzmir, Türkiye'
  }
];

export default function SupplierSearch({ onSelect, onAdd }: SupplierSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    type: 'company' as const,
    phone: '',
    email: '',
    address: ''
  });

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers([]);
    }
  }, [searchTerm]);

  const handleSubmitNewSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newSupplier);
    setShowAddForm(false);
    setNewSupplier({
      name: '',
      type: 'company',
      phone: '',
      email: '',
      address: ''
    });
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Arama Alanı */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearching(true);
          }}
          onFocus={() => setIsSearching(true)}
          className="w-full rounded-md border-gray-300 pl-10 focus:border-brand-green-500 focus:ring-brand-green-500"
          placeholder="Tedarikçi ara..."
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Arama Sonuçları */}
      {isSearching && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <div className="py-1">
            {filteredSuppliers.map((supplier) => (
              <button
                key={supplier.id}
                onClick={() => {
                  onSelect(supplier);
                  setSearchTerm(supplier.name);
                  setIsSearching(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {supplier.name}
                    </div>
                    {supplier.phone && (
                      <div className="text-xs text-gray-500">
                        {supplier.phone}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {supplier.type === 'company' ? 'Firma' : 'Bireysel'}
                  </span>
                </div>
              </button>
            ))}

            {/* Yeni Tedarikçi Ekleme Butonu */}
            <button
              onClick={() => {
                setShowAddForm(true);
                setIsSearching(false);
              }}
              className="w-full px-4 py-2 text-left text-brand-green-600 hover:bg-brand-green-50 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              <span>Yeni Tedarikçi Ekle</span>
            </button>
          </div>
        </div>
      )}

      {/* Yeni Tedarikçi Formu */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Yeni Tedarikçi Ekle
            </h3>

            <form onSubmit={handleSubmitNewSupplier} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tedarikçi Türü
                </label>
                <select
                  value={newSupplier.type}
                  onChange={(e) => setNewSupplier({ ...newSupplier, type: e.target.value as 'company' | 'individual' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                >
                  <option value="company">Firma</option>
                  <option value="individual">Bireysel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {newSupplier.type === 'company' ? 'Firma Adı' : 'Ad Soyad'}
                </label>
                <input
                  type="text"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <input
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adres
                </label>
                <textarea
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-green-500 hover:bg-brand-green-600 rounded-md"
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