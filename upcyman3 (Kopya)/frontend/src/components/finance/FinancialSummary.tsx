'use client';

import type { FinancialEntry } from '@/app/dashboard/finance/page';

interface FinancialSummaryProps {
  entries: FinancialEntry[];
}

export default function FinancialSummary({ entries }: FinancialSummaryProps) {
  // Kategori bazlı toplamları hesapla
  const totals = entries.reduce((acc, entry) => {
    const key = `${entry.type}_${entry.category}`;
    acc[key] = (acc[key] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  // Toplam gelir ve gider
  const totalIncome = entries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpense = entries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  // Kategori türünü Türkçe'ye çevir
  const getCategoryText = (category: string) => {
    switch (category) {
      case 'sales':
        return 'Satış';
      case 'utilities':
        return 'Faturalar';
      case 'rent':
        return 'Kira';
      case 'salary':
        return 'Maaş';
      case 'other':
        return 'Diğer';
      default:
        return category;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Toplam Özet */}
      <div className="col-span-full bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Genel Finansal Durum
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Toplam Gelir</div>
            <div className="mt-1 text-xl font-semibold text-green-600">
              ₺{totalIncome.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Toplam Gider</div>
            <div className="mt-1 text-xl font-semibold text-red-600">
              ₺{totalExpense.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Net Durum</div>
            <div className={`mt-1 text-xl font-semibold ${
              totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ₺{(totalIncome - totalExpense).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Gelir Detayları */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Gelir Detayları
        </h2>
        <div className="space-y-4">
          {Object.entries(totals)
            .filter(([key]) => key.startsWith('income'))
            .map(([key, amount]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {getCategoryText(key.split('_')[1])}
                </span>
                <span className="text-sm font-medium text-green-600">
                  ₺{amount.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Gider Detayları */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Gider Detayları
        </h2>
        <div className="space-y-4">
          {Object.entries(totals)
            .filter(([key]) => key.startsWith('expense'))
            .map(([key, amount]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {getCategoryText(key.split('_')[1])}
                </span>
                <span className="text-sm font-medium text-red-600">
                  ₺{amount.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 