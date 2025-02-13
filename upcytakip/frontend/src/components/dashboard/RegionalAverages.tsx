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

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['Marmara', 'Ege', 'İç Anadolu', 'Akdeniz', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu'],
  datasets: [
    {
      label: 'Ortalama Fiyat (₺/kg)',
      data: [3.25, 3.15, 3.05, 3.20, 3.10, 2.95, 3.00],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      min: Math.min(...data.datasets[0].data) - 0.2,
      max: Math.max(...data.datasets[0].data) + 0.2
    }
  }
};

export default function RegionalAverages() {
  return (
    <div className="h-[300px]">
      <Bar data={data} options={options} />
    </div>
  );
} 