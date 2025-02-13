'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SUBSCRIPTION_TYPES = [
  {
    id: 'standart',
    name: 'Standart',
    price: '499₺/ay',
    features: [
      'Günlük veri erişimi',
      'Temel raporlar',
      'Email desteği'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '999₺/ay',
    features: [
      'Gerçek zamanlı veri erişimi',
      'Gelişmiş raporlar',
      'Anlık bildirimler',
      'Öncelikli destek'
    ]
  },
  {
    id: 'kurumsal',
    name: 'Kurumsal',
    price: '2499₺/ay',
    features: [
      'Gerçek zamanlı veri erişimi',
      'Özel raporlar',
      'API erişimi',
      '7/24 destek',
      'Özel danışmanlık'
    ]
  }
];

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  phone: string;
  subscriptionType: string;
}

interface ApiError {
  message: string;
  status: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    subscriptionType: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Parola kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Parolalar eşleşmiyor');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          phone: formData.phone
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.message || 'Kayıt olurken bir hata oluştu');
      }

      router.push('/auth/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Beklenmeyen bir hata oluştu');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Abonelik Planınızı Seçin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Giriş Yapın
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SUBSCRIPTION_TYPES.map((type) => (
                <div
                  key={type.id}
                  className={`relative rounded-lg border p-4 cursor-pointer ${
                    formData.subscriptionType === type.id
                      ? 'border-primary-500 ring-2 ring-primary-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, subscriptionType: type.id })}
                >
                  <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{type.price}</p>
                  <ul className="mt-4 space-y-2">
                    {type.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-500">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={() => formData.subscriptionType && setStep(2)}
                disabled={!formData.subscriptionType}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Devam Et
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hesabınızı Oluşturun
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Şifre Tekrarı
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Firma Adı
              </label>
              <div className="mt-1">
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? 'Kaydediliyor...' : 'Kaydol'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 