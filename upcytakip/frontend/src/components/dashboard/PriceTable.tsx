import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon, FunnelIcon } from '@heroicons/react/24/solid';

// Tip tanımlamaları
interface PaperType {
  id: string;
  name: string;
  category: string;
}

interface RegionalPrice {
  min: string;
  max: string;
  avg: string;
}

interface PriceData extends PaperType {
  currentPrice: string;
  weeklyChange: string;
  monthlyChange: string;
  regionalPrices: Record<string, RegionalPrice>;
}

// Kağıt türleri ve kategorileri
const PAPER_TYPES: PaperType[] = [
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

// Her kağıt türü için rastgele fiyat ve değişim verileri oluştur
const generatePriceData = (): PriceData[] => {
  return PAPER_TYPES.map(type => {
    const basePrice = Math.random() * 3 + 2; // 2-5 TL arası
    const weeklyChange = (Math.random() - 0.5) * 10; // -5% ile +5% arası
    const monthlyChange = (Math.random() - 0.5) * 20; // -10% ile +10% arası
    
    const regionalPrices = REGIONS.reduce((acc, region) => {
      const minPrice = basePrice - Math.random() * 0.2;
      const maxPrice = basePrice + Math.random() * 0.2;
      acc[region] = {
        min: minPrice.toFixed(2),
        max: maxPrice.toFixed(2),
        avg: ((minPrice + maxPrice) / 2).toFixed(2)
      };
      return acc;
    }, {} as Record<string, RegionalPrice>);

    return {
      ...type,
      currentPrice: basePrice.toFixed(2),
      weeklyChange: weeklyChange.toFixed(1),
      monthlyChange: monthlyChange.toFixed(1),
      regionalPrices
    };
  });
};

export default function PriceTable() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('Marmara');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        // API çağrısı yapılacak
        // Şimdilik mock veri kullanıyoruz
        const mockData = generatePriceData();
        setPriceData(mockData);
      } catch (err) {
        setError('Fiyat verileri yüklenirken bir hata oluştu');
        console.error('Fiyat verisi yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const categories = ['all', ...new Set(PAPER_TYPES.map(type => type.category))];

  const filteredData = priceData.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-lg font-semibold">Hurda Kağıt Fiyat Listesi</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Tüm Kategoriler' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Seçilen kriterlere uygun veri bulunamadı
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kağıt Türü
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
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
                  Haftalık Değişim
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aylık Değişim
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.regionalPrices[selectedRegion].min}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.regionalPrices[selectedRegion].max}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.regionalPrices[selectedRegion].avg}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {Number(item.weeklyChange) > 0 ? (
                        <>
                          <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600">+{item.weeklyChange}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-600">{item.weeklyChange}%</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {Number(item.monthlyChange) > 0 ? (
                        <>
                          <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600">+{item.monthlyChange}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-600">{item.monthlyChange}%</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 