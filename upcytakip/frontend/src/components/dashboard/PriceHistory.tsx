import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface HistoricalData {
  id: string;
  date: string;
  paperType: string;
  category: string;
  region: string;
  minPrice: string;
  maxPrice: string;
  avgPrice: string;
  change: string;
  source?: string;
}

// Kağıt türleri ve kategorileri
const PAPER_TYPES = [
  { id: 'occ', name: 'OCC (Oluklu Mukavva)', category: 'Karton' },
  { id: 'mixed_paper', name: 'Karışık Kağıt', category: 'Kağıt' },
  { id: 'newspaper', name: 'Gazete', category: 'Gazete' },
  { id: 'white_paper', name: '1. Hamur Beyaz Kağıt', category: 'Beyaz Kağıt' },
  { id: 'colored_paper', name: 'Renkli Kağıt', category: 'Renkli' },
  { id: 'kraft', name: 'Kraft Kağıt', category: 'Kraft' },
  { id: 'coated', name: 'Kuşe Kağıt', category: 'Kuşe' }
];

const REGIONS = [
  'Marmara',
  'Ege',
  'İç Anadolu',
  'Akdeniz',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu'
];

// Geçmiş fiyat verilerini oluştur
const generateHistoricalData = (): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date();
  
  // Son 10 günlük veri
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    PAPER_TYPES.forEach(type => {
      const basePrice = Math.random() * 3 + 2;
      REGIONS.forEach(region => {
        const minPrice = (basePrice - Math.random() * 0.2).toFixed(2);
        const maxPrice = (basePrice + Math.random() * 0.2).toFixed(2);
        const avgPrice = ((parseFloat(minPrice) + parseFloat(maxPrice)) / 2).toFixed(2);
        
        data.push({
          id: `${date.toISOString()}-${type.id}-${region}`,
          date: date.toISOString().split('T')[0],
          paperType: type.name,
          category: type.category,
          region: region,
          minPrice,
          maxPrice,
          avgPrice,
          change: ((Math.random() - 0.5) * 6).toFixed(1),
          source: Math.random() > 0.7 ? 'ABC Kağıt Fabrikası' : undefined
        });
      });
    });
  }
  
  return data;
};

export default function PriceHistory() {
  const [historicalData] = useState<HistoricalData[]>(generateHistoricalData);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    paperType: 'all',
    region: 'all'
  });

  const paperTypes = ['all', ...PAPER_TYPES.map(type => type.name)];

  const filteredData = historicalData
    .filter(item => {
      if (filters.paperType !== 'all' && item.paperType !== filters.paperType) return false;
      if (filters.region !== 'all' && item.region !== filters.region) return false;
      if (item.date < filters.startDate || item.date > filters.endDate) return false;
      return true;
    })
    .slice(0, 10); // Sadece ilk 10 veriyi göster

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Son Fiyat Verileri</h2>
        
        {/* Filtreler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Tarih Aralığı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
            <div className="relative">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
            <div className="relative">
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kağıt Türü</label>
            <select
              value={filters.paperType}
              onChange={(e) => setFilters({ ...filters, paperType: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {paperTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tüm Türler' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Bölge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bölge</label>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="all">Tüm Bölgeler</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kağıt Türü
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bölge
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min. Fiyat (₺/kg)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max. Fiyat (₺/kg)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ort. Fiyat (₺/kg)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Günlük Değişim
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kaynak
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.date).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.paperType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.region}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.minPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.maxPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.avgPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {Number(item.change) > 0 ? (
                      <>
                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-600">+{item.change}%</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-600">{item.change}%</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.source || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 