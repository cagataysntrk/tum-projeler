'use client';

interface StockItem {
  materialType: string;
  currentAmount: number;
  capacity: number;
  lastUpdate: string;
}

interface StockStatusProps {
  stocks: StockItem[];
  newEntry?: {
    materialType: string;
    amount: number;
  };
}

const getStockLevelColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 70) return 'bg-yellow-500';
  return 'bg-brand-green-500';
};

const getStockLevelText = (percentage: number) => {
  if (percentage >= 90) return 'Kritik';
  if (percentage >= 70) return 'Orta';
  return 'İyi';
};

export default function StockStatus({ stocks, newEntry }: StockStatusProps) {
  const calculateNewAmount = (stock: StockItem) => {
    if (newEntry && newEntry.materialType === stock.materialType) {
      return stock.currentAmount + newEntry.amount;
    }
    return stock.currentAmount;
  };

  const calculatePercentage = (stock: StockItem) => {
    const amount = calculateNewAmount(stock);
    return Math.min((amount / stock.capacity) * 100, 100);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Stok Durumu
      </h2>

      <div className="space-y-4">
        {stocks.map((stock) => {
          const percentage = calculatePercentage(stock);
          const newAmount = calculateNewAmount(stock);
          const isUpdating = newEntry?.materialType === stock.materialType;

          return (
            <div key={stock.materialType} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">
                  {stock.materialType}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    percentage >= 90 ? 'text-red-600' : 
                    percentage >= 70 ? 'text-yellow-600' : 
                    'text-brand-green-600'
                  }`}>
                    {getStockLevelText(percentage)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {newAmount.toLocaleString('tr-TR')} / {stock.capacity.toLocaleString('tr-TR')} kg
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${getStockLevelColor(percentage)}`}
                  />
                </div>
                {isUpdating && (
                  <div className="absolute inset-0 flex items-center justify-end">
                    <span className="text-xs text-brand-green-600 bg-brand-green-100 px-2 py-1 rounded">
                      +{newEntry.amount} kg
                    </span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                Son güncelleme: {stock.lastUpdate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 