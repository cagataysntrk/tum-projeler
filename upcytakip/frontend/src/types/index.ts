export type UserRole = 'veri_girisci' | 'veri_goruntuleyen' | 'veri_admin' | 'sistem_admin' | 'superadmin';
export type SubscriptionType = 'standart' | 'pro' | 'kurumsal';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionType: SubscriptionType;
  subscriptionEndDate: string;
  company?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

export interface RegionalAverages {
  marmara: string;
  ege: string;
  anadolu: string;
}

export interface DashboardData {
  dailyAverage: string;
  weeklyChange: number;
  monthlyChange: number;
  regionalAverages: RegionalAverages;
  chartData: ChartData;
} 