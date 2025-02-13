import { useEffect, useState } from 'react';
import { UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  company: string;
  subscriptionType: string;
  subscriptionEndDate: string;
}

export default function ProfileCard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  if (!user) return null;

  // Abonelik bitiş tarihini hesapla
  const endDate = new Date(user.subscriptionEndDate);
  const today = new Date();
  const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const subscriptionStatus = remainingDays > 0 ? 'active' : 'expired';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <UserIcon className="h-8 w-8 text-primary-500" />
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.company}</p>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <ClockIcon className="h-5 w-5" />
          <span>Abonelik Durumu</span>
        </div>
        <div className="space-y-2">
          <p className="font-medium">{user.subscriptionType}</p>
          <p className={`text-sm ${remainingDays <= 7 ? 'text-red-500' : 'text-gray-500'}`}>
            {remainingDays} gün kaldı
          </p>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Abonelik Planı</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {user.subscriptionType.charAt(0).toUpperCase() + user.subscriptionType.slice(1)}
            </p>
          </div>
          <Link
            href="/auth/subscription"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Planı Değiştir
          </Link>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-500">Abonelik Durumu</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                subscriptionStatus === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {subscriptionStatus === 'active' ? 'Aktif' : 'Süresi Dolmuş'}
            </span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Kalan Gün</span>
              <span className={`font-medium ${remainingDays > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {remainingDays > 0 ? `${remainingDays} gün` : 'Süresi dolmuş'}
              </span>
            </div>
            <div className="mt-2 relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100, (remainingDays / 30) * 100))}%`
                  }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    remainingDays > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 