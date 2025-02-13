'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import MainLayout from '@/components/layout/MainLayout';
import { User, SubscriptionType } from '@/types';
import { toast } from 'react-hot-toast';

interface SubscriptionPlan {
  type: SubscriptionType;
  name: string;
  price: string;
  features: string[];
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    type: 'standart',
    name: 'Standart',
    price: '499',
    features: [
      'Günlük fiyat takibi',
      'Temel raporlar',
      'E-posta bildirimleri',
      'Mobil uygulama erişimi'
    ]
  },
  {
    type: 'pro',
    name: 'Pro',
    price: '999',
    features: [
      'Standart paket özellikleri',
      'Gerçek zamanlı fiyat takibi',
      'Gelişmiş raporlar ve analizler',
      'SMS bildirimleri',
      'Öncelikli destek'
    ]
  },
  {
    type: 'kurumsal',
    name: 'Kurumsal',
    price: '2499',
    features: [
      'Pro paket özellikleri',
      'API erişimi',
      'Özel raporlar',
      'Çoklu kullanıcı desteği',
      '7/24 öncelikli destek',
      'Yerinde eğitim'
    ]
  }
];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        company: userData.company || '',
        phone: userData.phone || ''
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(prev => prev ? { ...prev, ...formData } : null);
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
      setIsEditing(false);
      toast.success('Profil bilgileri güncellendi');
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleUpgradeSubscription = async (type: SubscriptionType) => {
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(prev => prev ? { ...prev, subscriptionType: type } : null);
      setIsSubscriptionModalOpen(false);
      toast.success('Aboneliğiniz güncellendi');
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            {/* Profil Başlığı */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profil Bilgileri</h3>
              <p className="mt-1 text-sm text-gray-500">
                Kişisel bilgilerinizi ve abonelik durumunuzu buradan yönetebilirsiniz
              </p>
            </div>

            {/* Profil Formu */}
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Firma
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Kaydet
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Düzenle
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Abonelik Bilgileri */}
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Abonelik Bilgileri</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Mevcut paket: {user.subscriptionType.charAt(0).toUpperCase() + user.subscriptionType.slice(1)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Bitiş tarihi: {new Date(user.subscriptionEndDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Paketi Yükselt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abonelik Modal */}
      <Dialog
        open={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Abonelik Paketleri
            </Dialog.Title>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.type}
                  className={`rounded-lg border ${
                    user.subscriptionType === plan.type
                      ? 'border-primary-500 ring-2 ring-primary-500'
                      : 'border-gray-200'
                  } p-6 bg-white shadow-sm`}
                >
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{plan.price}₺<span className="text-sm font-normal text-gray-500">/ay</span></p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-500">
                        <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => handleUpgradeSubscription(plan.type)}
                    disabled={user.subscriptionType === plan.type}
                    className={`mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md ${
                      user.subscriptionType === plan.type
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    }`}
                  >
                    {user.subscriptionType === plan.type ? 'Mevcut Paket' : 'Yükselt'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Kapat
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </MainLayout>
  );
} 