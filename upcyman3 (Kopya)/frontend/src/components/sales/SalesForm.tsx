'use client';

import { useState } from 'react';
import { 
  UserPlusIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  CalculatorIcon,
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { Customer, Product, Sale } from '@/app/dashboard/sales/page';

interface SalesFormProps {
  customers: Customer[];
  products: Product[];
  onSubmit: (data: Omit<Sale, 'id' | 'createdAt'>) => void;
}

// Yeni ürün formu için interface
interface NewProduct {
  name: string;
  type: string;
  stockAmount: number;
  unit: string;
  unitPrice: number;
}

export default function SalesForm({ customers, products, onSubmit }: SalesFormProps) {
  // Müşteri seçimi ve yeni müşteri formu state'leri
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    type: 'individual',
    phone: '',
    email: '',
    address: ''
  });

  // Ürün seçimi state'leri
  const [selectedProducts, setSelectedProducts] = useState<{
    productId: string;
    amount: number;
    unitPrice: number;
    totalPrice: number;
  }[]>([]);

  // Teslimat bilgileri state'leri
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Yeni ürün ve düzenleme state'leri
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    type: '',
    stockAmount: 0,
    unit: 'kg',
    unitPrice: 0
  });
  const [notes, setNotes] = useState('');

  // Müşteri düzenleme
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Ürün türünü Türkçe'ye çeviren yardımcı fonksiyon
  const getProductTypeText = (type: string) => {
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

  // Toplam tutarı hesapla
  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // Ürün ekleme/çıkarma işlemleri
  const handleProductChange = (productId: string, amount: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = selectedProducts.findIndex(p => p.productId === productId);
    const totalPrice = amount * product.unitPrice;

    if (existingIndex >= 0) {
      const newProducts = [...selectedProducts];
      if (amount <= 0) {
        newProducts.splice(existingIndex, 1);
      } else {
        newProducts[existingIndex] = {
          productId,
          amount,
          unitPrice: product.unitPrice,
          totalPrice
        };
      }
      setSelectedProducts(newProducts);
    } else if (amount > 0) {
      setSelectedProducts([
        ...selectedProducts,
        {
          productId,
          amount,
          unitPrice: product.unitPrice,
          totalPrice
        }
      ]);
    }
  };

  // Form gönderme işlemi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomerId || selectedProducts.length === 0) {
      alert('Lütfen müşteri ve en az bir ürün seçiniz');
      return;
    }

    const saleData: Omit<Sale, 'id' | 'createdAt'> = {
      customerId: selectedCustomerId,
      products: selectedProducts,
      totalAmount: calculateTotal(),
      deliveryDate,
      deliveryMethod,
      deliveryNotes,
      trackingNumber,
      status: 'pending'
    };

    onSubmit(saleData);
  };

  // Yeni ürün ekleme
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.type || newProduct.unitPrice <= 0) {
      alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    const productToAdd: Product = {
      id: `temp-${Date.now()}`, // Geçici ID
      ...newProduct
    };

    products.push(productToAdd);
    setShowNewProductForm(false);
    setNewProduct({
      name: '',
      type: '',
      stockAmount: 0,
      unit: 'kg',
      unitPrice: 0
    });
  };

  // Ürün düzenleme
  const handleEditProduct = (product: Product) => {
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          name: editingProduct?.name || p.name,
          type: editingProduct?.type || p.type,
          stockAmount: editingProduct?.stockAmount || p.stockAmount,
          unit: editingProduct?.unit || p.unit,
          unitPrice: editingProduct?.unitPrice || p.unitPrice
        };
      }
      return p;
    });

    // products array'ini güncelle
    products.splice(0, products.length, ...updatedProducts);
    setEditingProduct(null);
  };

  // Müşteri düzenleme
  const handleEditCustomer = (customer: Customer) => {
    const updatedCustomers = customers.map(c => {
      if (c.id === customer.id) {
        return {
          ...c,
          name: editingCustomer?.name || c.name,
          type: editingCustomer?.type || c.type,
          phone: editingCustomer?.phone || c.phone,
          email: editingCustomer?.email || c.email,
          address: editingCustomer?.address || c.address
        };
      }
      return c;
    });

    // customers array'ini güncelle
    customers.splice(0, customers.length, ...updatedCustomers);
    setEditingCustomer(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg divide-y divide-gray-200">
      {/* Müşteri Bilgileri Bölümü */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Müşteri Bilgileri
        </h3>

        {!showNewCustomerForm ? (
          <div className="space-y-4">
            {/* Müşteri Arama */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Müşteri ara..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Müşteri Listesi */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {customers
                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(customer => (
                  <label
                    key={customer.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCustomerId === customer.id
                        ? 'bg-brand-blue-50 border-brand-blue-500'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="customer"
                      value={customer.id}
                      checked={selectedCustomerId === customer.id}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="text-brand-blue-500 focus:ring-brand-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">
                        {customer.type === 'company' ? 'Şirket' : 'Bireysel'}
                        {customer.phone && ` • ${customer.phone}`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingCustomer(customer);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </label>
                ))}
            </div>

            {/* Yeni Müşteri Butonu */}
            <button
              type="button"
              onClick={() => setShowNewCustomerForm(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <UserPlusIcon className="h-5 w-5 mr-2 text-gray-500" />
              Yeni Müşteri Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Yeni Müşteri Formu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Tipi
                </label>
                <select
                  value={newCustomer.type}
                  onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value as 'individual' | 'company' })}
                  className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                >
                  <option value="individual">Bireysel</option>
                  <option value="company">Şirket</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  rows={3}
                  className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewCustomerForm(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => {
                  // Yeni müşteri API'ye gönderilecek
                  console.log('Yeni müşteri:', newCustomer);
                  setShowNewCustomerForm(false);
                }}
                className="px-4 py-2 bg-brand-blue-500 text-white text-sm font-medium rounded-md hover:bg-brand-blue-600"
              >
                Kaydet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ürün Seçimi Bölümü */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Ürün ve Miktar Seçimi
          </h3>
          <button
            type="button"
            onClick={() => setShowNewProductForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green-600 hover:bg-brand-green-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Yeni Ürün Ekle
          </button>
        </div>

        {showNewProductForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Yeni Ürün Ekle
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ürün Türü
                  </label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="plastic">Plastik</option>
                    <option value="paper">Kağıt</option>
                    <option value="metal">Metal</option>
                    <option value="glass">Cam</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stok Miktarı
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        value={newProduct.stockAmount}
                        onChange={(e) => setNewProduct({ ...newProduct, stockAmount: Number(e.target.value) })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 pr-12"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">kg</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Birim Fiyat
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₺</span>
                      </div>
                      <input
                        type="number"
                        value={newProduct.unitPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 pl-7"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewProductForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddProduct();
                    setShowNewProductForm(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-green-500 border border-transparent rounded-md hover:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {products.map(product => {
            const selectedProduct = selectedProducts.find(p => p.productId === product.id);
            const amount = selectedProduct?.amount || 0;
            const isEditing = editingProduct?.id === product.id;

            return (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                {isEditing ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                    />
                    <select
                      value={editingProduct.type}
                      onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })}
                      className="border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                    >
                      <option value="plastic">Plastik</option>
                      <option value="paper">Kağıt</option>
                      <option value="metal">Metal</option>
                      <option value="glass">Cam</option>
                    </select>
                    <div className="flex">
                      <input
                        type="number"
                        value={editingProduct.stockAmount}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stockAmount: parseFloat(e.target.value) })}
                        className="flex-1 rounded-l-md border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500"
                      />
                      <select
                        value={editingProduct.unit}
                        onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                        className="rounded-r-md border-l-0 border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500"
                      >
                        <option value="kg">kg</option>
                        <option value="ton">ton</option>
                        <option value="adet">adet</option>
                      </select>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.unitPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, unitPrice: parseFloat(e.target.value) })}
                      className="border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Tür: {getProductTypeText(product.type)} • Stok: {product.stockAmount} {product.unit} • Birim Fiyat: ₺{product.unitPrice}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditProduct(editingProduct)}
                        className="text-brand-green-600 hover:text-brand-green-700"
                      >
                        Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        İptal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleProductChange(product.id, Math.max(0, amount - 1))}
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>

                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => handleProductChange(product.id, Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-20 text-center border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                      />

                      <button
                        type="button"
                        onClick={() => handleProductChange(product.id, amount + 1)}
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>

                      {amount > 0 && (
                        <div className="ml-4 text-sm font-medium text-gray-900">
                          ₺{(amount * product.unitPrice).toFixed(2)}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {selectedProducts.length > 0 && (
            <div className="flex justify-end items-center space-x-2 text-lg font-medium">
              <CalculatorIcon className="h-6 w-6 text-gray-400" />
              <span className="text-gray-500">Toplam:</span>
              <span className="text-gray-900">₺{calculateTotal().toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notlar Bölümü */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Satış Notları
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
          placeholder="Satış ile ilgili özel notlar, özel fiyatlandırma detayları, müşteri talepleri vb..."
        />
      </div>

      {/* Teslimat Bilgileri Bölümü */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Teslimat Bilgileri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teslimat Tarihi
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teslimat Yöntemi
            </label>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              <option value="">Seçiniz...</option>
              <option value="company">Şirket Aracı</option>
              <option value="customer">Müşteri Alımı</option>
              <option value="cargo">Kargo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Takip Numarası
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teslimat Notları
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              rows={3}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
              placeholder="Teslimat ile ilgili özel notlar..."
            />
          </div>
        </div>
      </div>

      {/* Form Gönder Butonu */}
      <div className="p-6 bg-gray-50">
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
          >
            <TruckIcon className="h-5 w-5 mr-2" />
            Satışı Tamamla
          </button>
        </div>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ürün Düzenle
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Türü
                </label>
                <input
                  type="text"
                  value={editingProduct.type}
                  onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok Miktarı
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      value={editingProduct.stockAmount}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockAmount: Number(e.target.value) })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birim Fiyat
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₺</span>
                    </div>
                    <input
                      type="number"
                      value={editingProduct.unitPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, unitPrice: Number(e.target.value) })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 pl-7"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => {
                  handleEditProduct(editingProduct);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-green-500 border border-transparent rounded-md hover:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Müşteri Düzenleme Modalı */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Müşteri Düzenle
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Tipi
                </label>
                <select
                  value={editingCustomer.type}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, type: e.target.value as 'individual' | 'company' })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                >
                  <option value="individual">Bireysel</option>
                  <option value="company">Şirket</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <textarea
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => {
                  handleEditCustomer(editingCustomer);
                  setEditingCustomer(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-green-500 border border-transparent rounded-md hover:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
} 