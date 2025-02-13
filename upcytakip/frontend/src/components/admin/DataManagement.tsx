'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getToken } from '@/utils/auth';

interface PriceEntry {
  id: string;
  userId: string;
  userName: string;
  paperType: string;
  region: string;
  price: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface DataFilters {
  status?: string;
  region?: string;
  paperType?: string;
  startDate?: string;
  endDate?: string;
}

const INITIAL_ENTRIES: PriceEntry[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Ahmet Yılmaz',
    paperType: 'Karton',
    region: 'İstanbul',
    price: 3500,
    date: new Date().toISOString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '2',
    userName: 'Mehmet Demir',
    paperType: 'Gazete',
    region: 'Ankara',
    price: 2800,
    date: new Date().toISOString(),
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    userId: '3',
    userName: 'Ayşe Kaya',
    paperType: 'Beyaz Kağıt',
    region: 'İzmir',
    price: 4200,
    date: new Date().toISOString(),
    status: 'rejected',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const REGIONS = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana'];
const PAPER_TYPES = ['Karton', 'Gazete', 'Beyaz Kağıt', 'Renkli Kağıt', 'Kraft'];

export default function DataManagement() {
  const [entries, setEntries] = useState<PriceEntry[]>(INITIAL_ENTRIES);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DataFilters>({});
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.region) queryParams.append('region', filters.region);
      if (filters.paperType) queryParams.append('paperType', filters.paperType);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await fetch(`http://localhost:5000/api/admin/data/entries?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Veriler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      if (Array.isArray(data?.entries)) {
        setEntries(data.entries);
      } else {
        setEntries(INITIAL_ENTRIES);
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      toast.error('Veriler yüklenirken bir hata oluştu');
      setEntries(INITIAL_ENTRIES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [filters]);

  const handleUpdateStatus = async (entryId: string, status: 'approved' | 'rejected') => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/api/admin/data/entries/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Durum güncellenirken bir hata oluştu');

      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === entryId ? { ...entry, status, updatedAt: new Date().toISOString() } : entry
        )
      );
      
      toast.success('Durum başarıyla güncellendi');
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      toast.error('Durum güncellenirken bir hata oluştu');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedEntries.length === 0) {
      toast.error('Lütfen en az bir kayıt seçin');
      return;
    }

    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/api/admin/data/entries/bulk-action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryIds: selectedEntries,
          action: 'approve'
        })
      });

      if (!response.ok) throw new Error('Toplu onaylama işlemi başarısız oldu');

      setEntries(prevEntries =>
        prevEntries.map(entry =>
          selectedEntries.includes(entry.id)
            ? { ...entry, status: 'approved', updatedAt: new Date().toISOString() }
            : entry
        )
      );
      
      setSelectedEntries([]);
      toast.success('Seçili kayıtlar başarıyla onaylandı');
    } catch (error) {
      console.error('Toplu onaylama hatası:', error);
      toast.error('Toplu onaylama işlemi başarısız oldu');
    }
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
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          value={filters.status || ''}
        >
          <option value="">Tüm Durumlar</option>
          <option value="pending">Bekleyen</option>
          <option value="approved">Onaylı</option>
          <option value="rejected">Reddedilmiş</option>
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
          value={filters.region || ''}
        >
          <option value="">Tüm Bölgeler</option>
          {REGIONS.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, paperType: e.target.value }))}
          value={filters.paperType || ''}
        >
          <option value="">Tüm Kağıt Türleri</option>
          {PAPER_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <input
          type="date"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
          value={filters.startDate || ''}
        />

        <input
          type="date"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
          value={filters.endDate || ''}
        />
      </div>

      {/* Toplu İşlem Butonları */}
      {selectedEntries.length > 0 && (
        <div className="mb-4 flex justify-end space-x-2">
          <button
            onClick={handleBulkApprove}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Seçilenleri Onayla ({selectedEntries.length})
          </button>
        </div>
      )}

      {/* Veri Listesi */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={selectedEntries.length === entries.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEntries(entries.map(entry => entry.id));
                    } else {
                      setSelectedEntries([]);
                    }
                  }}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kağıt Türü
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bölge
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEntries(prev => [...prev, entry.id]);
                      } else {
                        setSelectedEntries(prev => prev.filter(id => id !== entry.id));
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{entry.userName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{entry.paperType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{entry.region}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{entry.price.toLocaleString('tr-TR')} ₺</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(entry.date).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entry.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : entry.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status === 'approved'
                      ? 'Onaylı'
                      : entry.status === 'rejected'
                      ? 'Reddedilmiş'
                      : 'Beklemede'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {entry.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(entry.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(entry.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reddet
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Toplam <span className="font-medium">{entries.length}</span> kayıt
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