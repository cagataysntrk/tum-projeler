import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const mockData = {
  labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
  datasets: [
    {
      label: 'Türkiye',
      data: [320, 340, 350, 370, 390, 400],
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.4
    },
    {
      label: 'Avrupa',
      data: [350, 360, 380, 390, 410, 420],
      borderColor: 'rgb(16, 185, 129)',
      tension: 0.4
    },
    {
      label: 'Amerika',
      data: [380, 390, 400, 410, 430, 440],
      borderColor: 'rgb(245, 158, 11)',
      tension: 0.4
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
      text: 'Global Fiyat Karşılaştırması (USD/Ton)'
    }
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
};

export default function GlobalPrices() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Global Fiyatlar</h2>
        <p className="text-sm text-gray-500">
          Türkiye ve global pazarlardaki hurda kağıt fiyatları karşılaştırması
        </p>
      </div>

      <div className="h-[300px]">
        <Line data={mockData} options={options} />
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Türkiye Ort.</p>
            <p className="text-lg font-semibold text-primary-600">$400/ton</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Avrupa Ort.</p>
            <p className="text-lg font-semibold text-green-600">$420/ton</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Amerika Ort.</p>
            <p className="text-lg font-semibold text-amber-600">$440/ton</p>
          </div>
        </div>
      </div>
    </div>
  );
} 