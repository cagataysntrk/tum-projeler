'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PerformanceData {
  date: string;
  wasteInput: number;
  processedMaterial: number;
  sales: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title: string;
}

export default function PerformanceChart({ data, title }: PerformanceChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="wasteInput"
              name="Atık Girişi"
              stroke="#32A332"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="processedMaterial"
              name="İşlenen Malzeme"
              stroke="#0066C1"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              name="Satışlar"
              stroke="#9333EA"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 