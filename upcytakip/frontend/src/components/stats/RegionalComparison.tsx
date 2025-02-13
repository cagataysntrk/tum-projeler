import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const mockData = {
  labels: ['İstanbul', 'İzmir', 'Ankara', 'Bursa', 'Adana', 'Antalya', 'Samsun', 'Trabzon'],
  datasets: [
    {
      label: 'Yurt İçi Fiyat (₺/kg)',
      data: [8.5, 8.2, 8.0, 8.3, 7.8, 7.9, 7.7, 7.6],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    },
    {
      label: 'İhracat Fiyatı (₺/kg)',
      data: [8.7, 8.4, 8.1, 8.5, 8.0, 8.1, 7.9, 7.8],
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Bölgesel Fiyat Karşılaştırması'
    }
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
};

export default function RegionalComparison() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Bölgesel Karşılaştırma</h2>
        <p className="text-sm text-gray-500">
          Şehirlere göre yurt içi ve ihracat fiyatları karşılaştırması
        </p>
      </div>

      <div className="h-[400px]">
        <Bar data={mockData} options={options} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900">En Yüksek Fiyat</h3>
          <p className="mt-2 text-2xl font-semibold text-blue-600">8.7₺/kg</p>
          <p className="text-sm text-blue-500">İstanbul - İhracat</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-900">Ortalama Fiyat</h3>
          <p className="mt-2 text-2xl font-semibold text-green-600">8.1₺/kg</p>
          <p className="text-sm text-green-500">Türkiye Geneli</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-900">En Düşük Fiyat</h3>
          <p className="mt-2 text-2xl font-semibold text-red-600">7.6₺/kg</p>
          <p className="text-sm text-red-500">Trabzon - Yurt İçi</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        * Fiyatlar son 7 günün ortalamasını yansıtmaktadır
      </div>
    </div>
  );
} 