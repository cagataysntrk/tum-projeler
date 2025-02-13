'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type SubscriptionType = 'standart' | 'pro' | 'kurumsal';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscriptionType: SubscriptionType;
  subscriptionEndDate: string;
}

interface Plan {
  price: string;
  name: string;
}

const SUBSCRIPTION_PLANS: Record<SubscriptionType, Plan> = {
  standart: {
    price: '499',
    name: 'Standart'
  },
  pro: {
    price: '999',
    name: 'Pro'
  },
  kurumsal: {
    price: '2499',
    name: 'Kurumsal'
  }
};

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser) as User;
      setUser(userData);
      
      const plan = SUBSCRIPTION_PLANS[userData.subscriptionType];
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, []);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Mock ödeme işlemi - gerçek implementasyonda payment gateway entegrasyonu yapılacak
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!user) return;

      // Başarılı ödeme sonrası yönlendirme
      switch (user.role) {
        case 'veri_girisci':
          router.push('/veri-giris');
          break;
        case 'veri_goruntuleyen':
          router.push('/dashboard');
          break;
        case 'veri_admin':
          router.push('/veri-yonetim');
          break;
        case 'sistem_admin':
          router.push('/sistem-yonetim');
          break;
        case 'superadmin':
          router.push('/admin');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Ödeme
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {selectedPlan.name} paketiniz için ödeme yapın
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{selectedPlan.name} Paket</span>
                    <span className="font-medium">{selectedPlan.price}₺/ay</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                Kart Numarası
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="card-number"
                  id="card-number"
                  placeholder="4242 4242 4242 4242"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                  Son Kullanma
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="expiry"
                    id="expiry"
                    placeholder="MM/YY"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="cvc"
                    id="cvc"
                    placeholder="123"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'İşleniyor...' : `${selectedPlan.price}₺ Öde`}
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Bu bir test sayfasıdır. Gerçek ödeme alınmamaktadır.
              <br />
              Test için 4242 4242 4242 4242 numaralı kartı kullanabilirsiniz.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 