'use client';

interface FacilityMetrics {
  id: string;
  name: string;
  operationalEfficiency: number;
  resourceUtilization: number;
  wasteProcessingRate: number;
  qualityScore: number;
  overallScore: number;
}

const mockFacilities: FacilityMetrics[] = [
  {
    id: '1',
    name: 'Tesis 1',
    operationalEfficiency: 87,
    resourceUtilization: 92,
    wasteProcessingRate: 85,
    qualityScore: 90,
    overallScore: 88.5
  },
  {
    id: '2',
    name: 'Tesis 2',
    operationalEfficiency: 82,
    resourceUtilization: 88,
    wasteProcessingRate: 80,
    qualityScore: 85,
    overallScore: 83.75
  },
  {
    id: '3',
    name: 'Tesis 3',
    operationalEfficiency: 91,
    resourceUtilization: 95,
    wasteProcessingRate: 88,
    qualityScore: 93,
    overallScore: 91.75
  }
];

export default function FacilityEfficiency() {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Tesis Verimlilikleri
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tesis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operasyonel Verimlilik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kaynak Kullanımı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşleme Hızı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kalite Puanı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Genel Skor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFacilities.map((facility) => (
              <tr key={facility.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {facility.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm ${getScoreColor(facility.operationalEfficiency)}`}>
                      {facility.operationalEfficiency}%
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${getProgressBarColor(facility.operationalEfficiency)} rounded-full h-2`}
                        style={{ width: `${facility.operationalEfficiency}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm ${getScoreColor(facility.resourceUtilization)}`}>
                      {facility.resourceUtilization}%
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${getProgressBarColor(facility.resourceUtilization)} rounded-full h-2`}
                        style={{ width: `${facility.resourceUtilization}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm ${getScoreColor(facility.wasteProcessingRate)}`}>
                      {facility.wasteProcessingRate}%
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${getProgressBarColor(facility.wasteProcessingRate)} rounded-full h-2`}
                        style={{ width: `${facility.wasteProcessingRate}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm ${getScoreColor(facility.qualityScore)}`}>
                      {facility.qualityScore}%
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${getProgressBarColor(facility.qualityScore)} rounded-full h-2`}
                        style={{ width: `${facility.qualityScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${getScoreColor(facility.overallScore)}`}>
                      {facility.overallScore}%
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${getProgressBarColor(facility.overallScore)} rounded-full h-2`}
                        style={{ width: `${facility.overallScore}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 