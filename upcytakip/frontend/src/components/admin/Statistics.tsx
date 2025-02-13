'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getToken } from '@/utils/auth';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { UserIcon, UsersIcon, DocumentIcon, ServerIcon } from '@heroicons/react/24/outline';
import { BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SystemStats {
  activeUsers: number;
  totalUsers: number;
  dailyActiveUsers: number;
  totalPriceEntries: number;
  dailyPriceEntries: number;
  apiRequests: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

export default function Statistics() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [userActivityData, setUserActivityData] = useState<ChartData | null>(null);
  const [resourceUsageData, setResourceUsageData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const [statsResponse, activityResponse, resourceResponse] = await Promise.all([
          fetch('http://localhost:5000/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/stats/user-activity', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/stats/resource-usage', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!statsResponse.ok || !activityResponse.ok || !resourceResponse.ok) {
          throw new Error('İstatistikler yüklenirken bir hata oluştu');
        }

        const [statsData, activityData, resourceData] = await Promise.all([
          statsResponse.json(),
          activityResponse.json(),
          resourceResponse.json()
        ]);

        setStats(statsData);
        setUserActivityData(activityData);
        setResourceUsageData(resourceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-600">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}g ${hours}s ${minutes}d`;
  };

  return (
    <div className="space-y-6">
      {/* Genel İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers}
          subtitle="Aktif: ${stats.activeUsers}"
          icon={<UserIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Günlük Aktif Kullanıcı"
          value={stats.dailyActiveUsers}
          subtitle="Son 24 saat"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Toplam Veri Girişi"
          value={stats.totalPriceEntries}
          subtitle="Bugün: ${stats.dailyPriceEntries}"
          icon={<DocumentIcon className="h-6 w-6" />}
        />
        <StatCard
          title="API İstekleri"
          value={stats.apiRequests}
          subtitle="Son 24 saat"
          icon={<ServerIcon className="h-6 w-6" />}
        />
      </div>

      {/* Sistem Durumu */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Durumu</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResourceCard
            title="CPU Kullanımı"
            value={stats.cpuUsage}
            color="blue"
          />
          <ResourceCard
            title="Bellek Kullanımı"
            value={stats.memoryUsage}
            color="green"
          />
          <ResourceCard
            title="Disk Kullanımı"
            value={stats.diskUsage}
            color="yellow"
          />
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Çalışma Süresi: {formatUptime(stats.uptime)}
        </div>
      </div>

      {/* Kullanıcı Aktivitesi Grafiği */}
      {userActivityData && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kullanıcı Aktivitesi</h3>
          <div className="h-80">
            <Line
              data={userActivityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Kaynak Kullanımı Grafiği */}
      {resourceUsageData && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kaynak Kullanımı</h3>
          <div className="h-80">
            <Bar
              data={resourceUsageData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="text-primary-500">{icon}</div>
      </div>
    </div>
  );
}

interface ResourceCardProps {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'yellow';
}

function ResourceCard({ title, value, color }: ResourceCardProps) {
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 bg-blue-100';
      case 'green':
        return 'text-green-600 bg-green-100';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}%</p>
        <div className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass()}`}>
          {value < 50 ? 'Normal' : value < 80 ? 'Orta' : 'Yüksek'}
        </div>
      </div>
      <div className="mt-2 relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
          <div
            style={{ width: `${value}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              color === 'blue'
                ? 'bg-blue-500'
                : color === 'green'
                ? 'bg-green-500'
                : 'bg-yellow-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
} 