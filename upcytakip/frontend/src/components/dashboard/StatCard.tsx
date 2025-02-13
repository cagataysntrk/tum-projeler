interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && <div className="text-primary-500">{icon}</div>}
      </div>
      
      {typeof change !== 'undefined' && (
        <div className="mt-4">
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              isPositive
                ? 'bg-green-100 text-green-800'
                : isNegative
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isPositive && '↑'}
            {isNegative && '↓'}
            {Math.abs(change)}%
          </div>
        </div>
      )}
    </div>
  );
} 