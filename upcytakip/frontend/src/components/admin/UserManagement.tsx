'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, UserRole, SubscriptionType } from '@/types';
import { getToken } from '@/utils/auth';

interface UserFilters {
  role?: UserRole;
  subscriptionType?: SubscriptionType;
  isActive?: boolean;
  search?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Test Kullanıcı',
    email: 'test@example.com',
    role: 'veri_girisci',
    subscriptionType: 'standart',
    subscriptionEndDate: new Date().toISOString(),
    isActive: true,
    lastLogin: new Date().toISOString()
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const queryParams = new URLSearchParams();
      
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.subscriptionType) queryParams.append('subscriptionType', filters.subscriptionType);
      if (filters.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`http://localhost:5000/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Kullanıcılar yüklenirken bir hata oluştu');

      const data = await response.json();
      setUsers(data.users || mockUsers);
    } catch (error) {
      toast.error('Kullanıcılar yüklenirken bir hata oluştu');
      console.error('Kullanıcı yükleme hatası:', error);
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Kullanıcı güncellenirken bir hata oluştu');

      toast.success('Kullanıcı başarıyla güncellendi');
      fetchUsers();
    } catch (error) {
      toast.error('Kullanıcı güncellenirken bir hata oluştu');
      console.error('Kullanıcı güncelleme hatası:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    await handleUpdateUser(userId, { isActive });
  };

  const handleUpdateRole = async (userId: string, role: UserRole) => {
    await handleUpdateUser(userId, { role });
  };

  const handleUpdateSubscription = async (userId: string, subscriptionType: SubscriptionType) => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    await handleUpdateUser(userId, {
      subscriptionType,
      subscriptionEndDate: endDate.toISOString()
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filtreler */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as UserRole }))}
          value={filters.role || ''}
        >
          <option value="">Tüm Roller</option>
          <option value="veri_girisci">Veri Girişçi</option>
          <option value="veri_goruntuleyen">Veri Görüntüleyen</option>
          <option value="veri_admin">Veri Admin</option>
          <option value="sistem_admin">Sistem Admin</option>
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, subscriptionType: e.target.value as SubscriptionType }))}
          value={filters.subscriptionType || ''}
        >
          <option value="">Tüm Abonelikler</option>
          <option value="standart">Standart</option>
          <option value="pro">Pro</option>
          <option value="kurumsal">Kurumsal</option>
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
          value={filters.isActive?.toString() || ''}
        >
          <option value="">Tüm Durumlar</option>
          <option value="true">Aktif</option>
          <option value="false">Pasif</option>
        </select>

        <input
          type="text"
          placeholder="Ara..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          value={filters.search || ''}
        />
      </div>

      {/* Kullanıcı Listesi */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Abonelik
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Giriş
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className="text-sm text-gray-900 bg-transparent border-0 cursor-pointer hover:text-primary-600 focus:ring-0"
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                  >
                    <option value="veri_girisci">Veri Girişçi</option>
                    <option value="veri_goruntuleyen">Veri Görüntüleyen</option>
                    <option value="veri_admin">Veri Admin</option>
                    <option value="sistem_admin">Sistem Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className="text-sm text-gray-900 bg-transparent border-0 cursor-pointer hover:text-primary-600 focus:ring-0"
                    value={user.subscriptionType}
                    onChange={(e) => handleUpdateSubscription(user.id, e.target.value as SubscriptionType)}
                  >
                    <option value="standart">Standart</option>
                    <option value="pro">Pro</option>
                    <option value="kurumsal">Kurumsal</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                      user.isActive
                        ? 'text-green-800 bg-green-100 hover:bg-green-200'
                        : 'text-red-800 bg-red-100 hover:bg-red-200'
                    }`}
                  >
                    {user.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString('tr-TR') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(true);
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Toplam <span className="font-medium">{users.length}</span> kullanıcı
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Önceki
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
} 