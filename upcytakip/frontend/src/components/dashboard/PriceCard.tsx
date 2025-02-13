import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface PriceCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export default function PriceCard({ title, value, change, trend }: PriceCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="ml-2 flex items-baseline text-sm font-semibold">
          {trend === 'up' ? (
            <>
              <ArrowUpIcon
                className="h-4 w-4 flex-shrink-0 self-center text-green-500"
                aria-hidden="true"
              />
              <span className="text-green-600">{change}</span>
            </>
          ) : (
            <>
              <ArrowDownIcon
                className="h-4 w-4 flex-shrink-0 self-center text-red-500"
                aria-hidden="true"
              />
              <span className="text-red-600">{change}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
} 