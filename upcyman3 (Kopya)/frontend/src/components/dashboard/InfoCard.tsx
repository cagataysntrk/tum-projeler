'use client';

interface InfoCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
}

export default function InfoCard({ title, value, change, icon, description }: InfoCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-brand-green-100 flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
          <div className={`${icon ? 'ml-5' : ''} w-0 flex-1`}>
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {change !== undefined && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                  </div>
                )}
              </dd>
              {description && (
                <dd className="mt-1 text-sm text-gray-500">
                  {description}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 