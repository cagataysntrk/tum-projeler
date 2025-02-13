import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { CalendarIcon } from '@heroicons/react/24/solid';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PAPER_TYPES = [
  { id: 1, name: '1. Hamur Kağıt', category: 'Beyaz Kağıt' },
  { id: 2, name: 'Karton', category: 'Karton' },
  { id: 3, name: 'Gazete', category: 'Gazete' },
  { id: 4, name: 'Renkli Kağıt', category: 'Renkli' },
  { id: 5, name: 'Kraft Kağıt', category: 'Kraft' },
  { id: 6, name: 'Kuşe Kağıt', category: 'Kuşe' }
];

const REGIONS = ['Marmara', 'Ege', 'İç Anadolu', 'Akdeniz', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu'];

// Rastgele renk üret
const generateColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsla(${Math.random() * 360}, 70%, 50%, 0.8)`);
  }
  return colors;
};

export default function PriceCharts() {
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    paperType: 'all',
    region: 'all'
  });

  // Çizgi grafik için veri
  const lineData = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: 'Ortalama Fiyat (₺/kg)',
        data: Array.from({ length: 30 }, () => Math.random() * 2 + 2),
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4
      }
    ]
  };

  // Pasta grafik için veri
  const pieData = {
    labels: PAPER_TYPES.map(type => type.name),
    datasets: [
      {
        data: PAPER_TYPES.map(() => Math.random() * 100),
        backgroundColor: generateColors(PAPER_TYPES.length)
      }
    ]
  };

  // Sütun grafik için veri
  const barData = {
    labels: REGIONS,
    datasets: [
      {
        label: 'Bölgesel Ortalama Fiyat (₺/kg)',
        data: REGIONS.map(() => Math.random() * 2 + 2),
        backgroundColor: 'rgba(59, 130, 246, 0.5)'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-4">Fiyat Analiz Grafikleri</h2>

      {/* Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
          <div className="relative">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <CalendarIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
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
            <CalendarIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kağıt Türü</label>
          <select
            value={filters.paperType}
            onChange={(e) => setFilters({ ...filters, paperType: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">Tüm Türler</option>
            {PAPER_TYPES.map(type => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>

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

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Çizgi Grafik */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Fiyat Trendi</h3>
          <div className="h-[300px]">
            <Line data={lineData} options={options} />
          </div>
        </div>

        {/* Pasta Grafik */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Kağıt Türü Dağılımı</h3>
          <div className="h-[300px]">
            <Pie data={pieData} options={options} />
          </div>
        </div>

        {/* Sütun Grafik */}
        <div className="bg-white p-4 rounded-lg border lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Bölgesel Fiyat Karşılaştırması</h3>
          <div className="h-[300px]">
            <Bar data={barData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
} 