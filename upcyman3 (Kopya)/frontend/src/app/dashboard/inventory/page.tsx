'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InventoryTable from '@/components/inventory/InventoryTable';
import StockAdjustmentModal from '@/components/inventory/StockAdjustmentModal';
import AlertPanel from '@/components/inventory/AlertPanel';
import StockHistory from '@/components/inventory/StockHistory';

export interface StockItem {
  id: string;
  materialType: string;
  materialName: string;
  facility: string;
  currentAmount: number;
  unit: string;
  lastUpdate: string;
  minThreshold: number;
  maxThreshold: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface StockAdjustment {
  id: string;
  stockId: string;
  adjustmentType: 'increase' | 'decrease';
  amount: number;
  reason: string;
  notes?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
}

export interface StockHistory {
  id: string;
  stockId: string;
  materialName: string;
  materialType: string;
  facility: string;
  changeType: 'increase' | 'decrease';
  amount: number;
  unit: string;
  source: 'waste_entry' | 'operation' | 'sale' | 'adjustment';
  timestamp: string;
  previousAmount: number;
  newAmount: number;
  notes?: string;
}

// Örnek stok verileri
const mockStocks: StockItem[] = [
  {
    id: '1',
    materialType: 'plastic',
    materialName: 'PET Şişe',
    facility: 'Tesis 1',
    currentAmount: 1500,
    unit: 'kg',
    lastUpdate: '2024-02-11 15:30',
    minThreshold: 1000,
    maxThreshold: 5000,
    status: 'normal'
  },
  {
    id: '2',
    materialType: 'paper',
    materialName: 'Karton',
    facility: 'Tesis 2',
    currentAmount: 800,
    unit: 'kg',
    lastUpdate: '2024-02-11 14:45',
    minThreshold: 1000,
    maxThreshold: 4000,
    status: 'warning'
  },
  {
    id: '3',
    materialType: 'metal',
    materialName: 'Alüminyum',
    facility: 'Tesis 1',
    currentAmount: 300,
    unit: 'kg',
    lastUpdate: '2024-02-11 13:15',
    minThreshold: 500,
    maxThreshold: 3000,
    status: 'critical'
  }
];

// Örnek stok geçmişi verileri
const mockStockHistory: StockHistory[] = [
  {
    id: '1',
    stockId: '1',
    materialName: 'PET Şişe',
    materialType: 'plastic',
    facility: 'Tesis 1',
    changeType: 'increase',
    amount: 500,
    unit: 'kg',
    source: 'waste_entry',
    timestamp: '2024-02-11 15:30',
    previousAmount: 1000,
    newAmount: 1500,
    notes: 'Atık kabul girişi'
  },
  {
    id: '2',
    stockId: '2',
    materialName: 'Karton',
    materialType: 'paper',
    facility: 'Tesis 2',
    changeType: 'decrease',
    amount: 200,
    unit: 'kg',
    source: 'operation',
    timestamp: '2024-02-11 14:45',
    previousAmount: 1000,
    newAmount: 800,
    notes: 'İşleme alındı'
  },
  {
    id: '3',
    stockId: '3',
    materialName: 'Alüminyum',
    materialType: 'metal',
    facility: 'Tesis 1',
    changeType: 'decrease',
    amount: 100,
    unit: 'kg',
    source: 'sale',
    timestamp: '2024-02-11 13:15',
    previousAmount: 400,
    newAmount: 300,
    notes: 'Satış yapıldı'
  }
];

export default function InventoryPage() {
  const [stocks, setStocks] = useState<StockItem[]>(mockStocks);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>(mockStockHistory);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    facility: '',
    materialType: '',
    status: ''
  });
  const [historyFilters, setHistoryFilters] = useState({
    timeRange: 'daily',
    facility: '',
    materialType: '',
    source: ''
  });

  const handleStockAdjustment = (adjustment: Omit<StockAdjustment, 'id' | 'createdAt'>) => {
    // API'ye gönderilecek
    console.log('Stok düzeltme:', adjustment);
    
    // Başarılı mesajı göster
    alert('Stok düzeltme talebi oluşturuldu.');
    setIsAdjustmentModalOpen(false);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Filtreleme işlemleri burada yapılacak
  };

  const handleHistoryFilterChange = (newFilters: typeof historyFilters) => {
    setHistoryFilters(newFilters);
    // Geçmiş filtreleme işlemleri burada yapılacak
  };

  const handleExportHistory = () => {
    // CSV formatında dışa aktarma işlemi
    const headers = ['Tarih', 'Malzeme', 'Tesis', 'Değişim', 'Miktar', 'Önceki', 'Sonraki', 'Kaynak', 'Notlar'];
    const rows = stockHistory.map(history => [
      history.timestamp,
      history.materialName,
      history.facility,
      history.changeType === 'increase' ? 'Artış' : 'Azalış',
      `${history.amount} ${history.unit}`,
      `${history.previousAmount} ${history.unit}`,
      `${history.newAmount} ${history.unit}`,
      history.source,
      history.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `stok_gecmisi_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-2 font-bold text-gray-900">
            Stok Yönetimi
          </h1>
        </div>

        {/* Uyarı Paneli */}
        <AlertPanel stocks={stocks} />

        {/* Ana İçerik */}
        <div className="space-y-6">
          {/* Stok Tablosu */}
          <InventoryTable
            stocks={stocks}
            filters={filters}
            onFilterChange={handleFilterChange}
            onAdjustStock={(stock) => {
              setSelectedStock(stock);
              setIsAdjustmentModalOpen(true);
            }}
          />

          {/* Stok Geçmişi */}
          <StockHistory
            history={stockHistory}
            filters={historyFilters}
            onFilterChange={handleHistoryFilterChange}
            onExport={handleExportHistory}
          />
        </div>

        {/* Stok Düzeltme Modalı */}
        {selectedStock && (
          <StockAdjustmentModal
            isOpen={isAdjustmentModalOpen}
            onClose={() => {
              setIsAdjustmentModalOpen(false);
              setSelectedStock(null);
            }}
            stock={selectedStock}
            onSubmit={handleStockAdjustment}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 