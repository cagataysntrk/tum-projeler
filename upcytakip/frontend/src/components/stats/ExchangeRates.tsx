import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface ExchangeRate {
  currency: string;
  buy: number;
  sell: number;
  change: number;
  lastUpdate: string;
}

const mockRates: ExchangeRate[] = [
  {
    currency: 'USD',
    buy: 31.25,
    sell: 31.35,
    change: 0.45,
    lastUpdate: '2024-02-20 14:30'
  },
  {
    currency: 'EUR',
    buy: 33.75,
    sell: 33.85,
    change: -0.25,
    lastUpdate: '2024-02-20 14:30'
  },
  {
    currency: 'GBP',
    buy: 39.45,
    sell: 39.55,
    change: 0.15,
    lastUpdate: '2024-02-20 14:30'
  }
];

export default function ExchangeRates() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Döviz Kurları</h2>
        <p className="text-sm text-gray-500">
          TCMB güncel döviz kurları ve değişimler
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Döviz
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alış
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satış
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Değişim
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Güncelleme
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockRates.map((rate) => (
              <tr key={rate.currency} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {rate.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rate.buy.toFixed(2)}₺
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rate.sell.toFixed(2)}₺
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {rate.change > 0 ? (
                      <>
                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-600">+{rate.change}%</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-600">{rate.change}%</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rate.lastUpdate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-right">
        * Veriler TCMB&apos;den alınmaktadır
      </div>
    </div>
  );
} 