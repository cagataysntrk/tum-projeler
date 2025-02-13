'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CostAnalysis from '@/components/finance/CostAnalysis';
import IncomeExpense from '@/components/finance/IncomeExpense';
import ProfitabilityPanel from '@/components/finance/ProfitabilityPanel';
import FinancialSummary from '@/components/finance/FinancialSummary';
import MonthlyFinanceTable from '@/components/finance/MonthlyFinanceTable';

// Maliyet türleri
export type CostType = 'waste' | 'processing' | 'labor' | 'energy' | 'maintenance' | 'other';

// Maliyet verisi
export interface CostData {
  id: string;
  type: CostType;
  amount: number;
  date: string;
  facility: string;
  description?: string;
  category: 'input' | 'output';
}

// Gelir/Gider verisi
export interface FinancialEntry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  facility: string;
  description?: string;
}

// Kârlılık verisi
export interface ProfitabilityData {
  period: string;
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
}

// Aylık finans detayı
export interface MonthlyFinanceDetail {
  id: string;
  month: string;
  year: number;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  facility: string;
}

// Örnek maliyet verileri
const mockCosts: CostData[] = [
  {
    id: '1',
    type: 'waste',
    amount: 25000,
    date: '2024-02-01',
    facility: 'Tesis 1',
    description: 'PET Atık Alımı',
    category: 'input'
  },
  {
    id: '2',
    type: 'processing',
    amount: 15000,
    date: '2024-02-01',
    facility: 'Tesis 1',
    description: 'Hat-1 İşleme Maliyeti',
    category: 'output'
  },
  {
    id: '3',
    type: 'labor',
    amount: 45000,
    date: '2024-02-01',
    facility: 'Tesis 1',
    description: 'Personel Maaşları',
    category: 'output'
  }
];

// Örnek gelir/gider verileri
const mockEntries: FinancialEntry[] = [
  {
    id: '1',
    type: 'income',
    category: 'sales',
    amount: 120000,
    date: '2024-02-01',
    facility: 'Tesis 1',
    description: 'PET Granül Satışı'
  },
  {
    id: '2',
    type: 'expense',
    category: 'utilities',
    amount: 8500,
    date: '2024-02-01',
    facility: 'Tesis 1',
    description: 'Elektrik Faturası'
  }
];

// Örnek kârlılık verileri
const mockProfitability: ProfitabilityData[] = [
  {
    period: '2024-02',
    totalRevenue: 120000,
    totalCosts: 93500,
    grossProfit: 26500,
    netProfit: 21200,
    profitMargin: 17.67
  }
];

// Örnek aylık finans detayları
const mockMonthlyDetails: MonthlyFinanceDetail[] = [
  {
    id: '1',
    month: '02',
    year: 2024,
    category: 'sales',
    type: 'income',
    amount: 120000,
    description: 'PET Granül Satışı',
    facility: 'Tesis 1'
  },
  {
    id: '2',
    month: '02',
    year: 2024,
    category: 'utilities',
    type: 'expense',
    amount: 8500,
    description: 'Elektrik Faturası',
    facility: 'Tesis 1'
  }
];

export default function FinancePage() {
  const [costs, setCosts] = useState<CostData[]>(mockCosts);
  const [entries, setEntries] = useState<FinancialEntry[]>(mockEntries);
  const [profitability, setProfitability] = useState<ProfitabilityData[]>(mockProfitability);
  const [monthlyDetails, setMonthlyDetails] = useState<MonthlyFinanceDetail[]>(mockMonthlyDetails);

  const handleCostSubmit = (data: Omit<CostData, 'id'>) => {
    // API'ye gönderilecek
    console.log('Yeni maliyet:', data);
  };

  const handleEntrySubmit = (data: Omit<FinancialEntry, 'id'>) => {
    // API'ye gönderilecek
    console.log('Yeni gelir/gider:', data);
  };

  const handleExport = (type: 'costs' | 'entries' | 'profitability' | 'monthly') => {
    // Dışa aktarma işlemi
    console.log(`${type} verilerini dışa aktar`);
  };

  const handleMonthlyDetailSubmit = (data: Omit<MonthlyFinanceDetail, 'id'>) => {
    // API'ye gönderilecek
    console.log('Yeni aylık detay:', data);
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-2 font-bold text-gray-900">
            Finansal Yönetim
          </h1>
        </div>

        {/* Finansal Özet */}
        <FinancialSummary entries={entries} />

        {/* Kârlılık Paneli */}
        <ProfitabilityPanel data={profitability} onExport={() => handleExport('profitability')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Maliyet Analizi */}
          <CostAnalysis
            costs={costs}
            onSubmit={handleCostSubmit}
            onExport={() => handleExport('costs')}
          />

          {/* Gelir/Gider */}
          <IncomeExpense
            entries={entries}
            onSubmit={handleEntrySubmit}
            onExport={() => handleExport('entries')}
          />
        </div>

        {/* Aylık Finans Detay Tablosu */}
        <MonthlyFinanceTable
          details={monthlyDetails}
          onSubmit={handleMonthlyDetailSubmit}
          onExport={() => handleExport('monthly')}
        />
      </div>
    </DashboardLayout>
  );
} 