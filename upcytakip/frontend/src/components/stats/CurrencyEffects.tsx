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
      label: 'TL Bazlı Fiyat',
      data: [7500, 7800, 8200, 8500, 8800, 9000],
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.4
    },
    {
      label: 'USD Bazlı Fiyat',
      data: [400, 410, 415, 420, 425, 430],
      borderColor: 'rgb(16, 185, 129)',
      tension: 0.4,
      yAxisID: 'y1'
    }
  ]
};

const options = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'TL/USD Bazlı Fiyat Karşılaştırması'
    }
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      title: {
        display: true,
        text: 'TL/Ton'
      }
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      title: {
        display: true,
        text: 'USD/Ton'
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export default function CurrencyEffects() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Döviz Etkisi</h2>
        <p className="text-sm text-gray-500">
          TL ve USD bazında hurda kağıt fiyat değişimleri
        </p>
      </div>

      <div className="h-[300px]">
        <Line data={mockData} options={options} />
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">TL Değişim (Son 1 Ay)</p>
            <p className="text-lg font-semibold text-primary-600">+2.3%</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">USD Değişim (Son 1 Ay)</p>
            <p className="text-lg font-semibold text-green-600">+1.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
} 