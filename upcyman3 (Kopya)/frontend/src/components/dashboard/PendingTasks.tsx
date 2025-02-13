'use client';

interface Task {
  id: string;
  title: string;
  type: 'waste_acceptance' | 'operation' | 'sale' | 'maintenance' | 'personnel';
  status: 'pending' | 'in_progress';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
  facility: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'PET Atık Kabulü',
    type: 'waste_acceptance',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-02-12 14:00',
    assignee: 'Ahmet Yılmaz',
    facility: 'Tesis 1'
  },
  {
    id: '2',
    title: 'Hat-2 Bakım',
    type: 'maintenance',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-02-12 16:00',
    assignee: 'Mehmet Demir',
    facility: 'Tesis 2'
  },
  {
    id: '3',
    title: 'Plastik Granül Satışı',
    type: 'sale',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-02-12 15:00',
    assignee: 'Ayşe Kaya',
    facility: 'Tesis 1'
  },
  {
    id: '4',
    title: 'Yeni Operatör İşe Alımı',
    type: 'personnel',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-02-13',
    assignee: 'Zeynep Şahin',
    facility: 'Tesis 3'
  }
];

export default function PendingTasks() {
  const getTypeText = (type: Task['type']) => {
    switch (type) {
      case 'waste_acceptance':
        return 'Atık Kabul';
      case 'operation':
        return 'Operasyon';
      case 'sale':
        return 'Satış';
      case 'maintenance':
        return 'Bakım';
      case 'personnel':
        return 'Personel';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'waste_acceptance':
        return '📦';
      case 'operation':
        return '⚙️';
      case 'sale':
        return '💰';
      case 'maintenance':
        return '🔧';
      case 'personnel':
        return '👥';
      default:
        return '📋';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'Yüksek';
      case 'medium':
        return 'Orta';
      case 'low':
        return 'Düşük';
      default:
        return priority;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'in_progress':
        return 'Devam Ediyor';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Bekleyen İşlemler
        </h2>
        <span className="text-sm text-gray-500">
          Toplam: {mockTasks.length} işlem
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tesis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Öncelik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Termin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sorumlu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getTypeIcon(task.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getTypeText(task.type)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.facility}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                    {getPriorityText(task.priority)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.dueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.assignee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 