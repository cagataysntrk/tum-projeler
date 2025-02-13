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

const generateDates = (days: number) => {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }));
  }
  return dates;
};

const generateData = (days: number) => {
  const basePrice = 3.2;
  return Array.from({ length: days }, () => {
    return basePrice + (Math.random() - 0.5) * 0.4;
  });
};

const data = {
  labels: generateDates(14),
  datasets: [
    {
      label: 'Fiyat (₺/kg)',
      data: generateData(14),
      fill: false,
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.4
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

export default function MarketTrends() {
  return (
    <div className="h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
} 