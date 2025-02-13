'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/Modal';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import trLocale from '@fullcalendar/core/locales/tr';

interface Machine {
  id: number;
  name: string;
  status: 'normal' | 'warning' | 'critical';
  lastMaintenance: string;
  nextMaintenance: string;
  description: string;
  model?: string;
  serialNumber?: string;
  manufacturer?: string;
  installationDate?: string;
  location?: string;
  department?: string;
  maintenanceHistory?: MaintenanceEvent[];
  documents?: {
    id: number;
    name: string;
    url: string;
    type: string;
  }[];
}

interface MaintenanceEvent {
  id: number;
  machineId: number;
  machineName: string;
  eventType: 'maintenance' | 'repair' | 'breakdown' | 'inspection';
  description: string;
  date: string;
  cost: number;
  status: 'completed' | 'pending' | 'in_progress';
  technician: string;
  priority: 'low' | 'medium' | 'high';
  workDone?: string;
  partsUsed?: {
    name: string;
    quantity: number;
    cost: number;
  }[];
  documents?: {
    id: number;
    name: string;
    url: string;
    type: string;
  }[];
  notes?: string;
  duration?: number;
  completedAt?: string;
  approvedBy?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    type: 'maintenance' | 'repair' | 'breakdown' | 'inspection';
    machineId: number;
    machineName: string;
    description: string;
    cost: number;
    status: 'completed' | 'pending' | 'in_progress';
    technician: string;
  };
}

// Örnek makine listesi
const machines: Machine[] = [
  { id: 1, name: 'Makine 1', status: 'normal', lastMaintenance: '2023-05-10', nextMaintenance: '2023-08-10', description: '' },
  { id: 2, name: 'Makine 2', status: 'warning', lastMaintenance: '2023-04-15', nextMaintenance: '2023-07-15', description: '' },
  { id: 3, name: 'Makine 3', status: 'critical', lastMaintenance: '2023-03-20', nextMaintenance: '2023-06-20', description: '' },
  // Diğer makineler...
];

// Örnek bakım verileri
const maintenanceEvents: MaintenanceEvent[] = [
  {
    id: 1,
    machineId: 1,
    machineName: 'Makine 1',
    eventType: 'maintenance',
    description: 'Planlı bakım yapıldı',
    date: '2024-02-10',
    cost: 1500,
    status: 'completed',
    technician: 'Ahmet Yılmaz',
    priority: 'medium'
  },
  {
    id: 2,
    machineId: 2,
    machineName: 'Makine 2',
    eventType: 'breakdown',
    description: 'Arıza giderildi',
    date: '2024-02-09',
    cost: 2500,
    status: 'completed',
    technician: 'Mehmet Demir',
    priority: 'high'
  },
  {
    id: 3,
    machineId: 1,
    machineName: 'Makine 1',
    eventType: 'inspection',
    description: 'Aylık kontrol',
    date: '2024-02-08',
    cost: 500,
    status: 'completed',
    technician: 'Ali Kaya',
    priority: 'low'
  },
  // ... diğer olaylar
];

// Örnek bakım verileri
const maintenanceHistory: MaintenanceEvent[] = [
  {
    id: 1,
    machineId: 1,
    machineName: 'Makine 1',
    eventType: 'maintenance',
    description: 'Yağ değişimi',
    date: '2023-05-10',
    cost: 1000,
    status: 'completed',
    technician: 'Ahmet Yılmaz',
    priority: 'medium'
  },
  {
    id: 2,
    machineId: 1,
    machineName: 'Makine 1',
    eventType: 'repair',
    description: 'Filtre değişimi',
    date: '2023-04-15',
    cost: 500,
    status: 'completed',
    technician: 'Mehmet Demir',
    priority: 'low'
  },
  // Diğer bakım kayıtları...
];

export default function MaintenancePage() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [description, setDescription] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [parts, setParts] = useState('');
  const [cost, setCost] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isAddMachineModalOpen, setIsAddMachineModalOpen] = useState(false);
  const [isEditMachineModalOpen, setIsEditMachineModalOpen] = useState(false);
  const [newMachine, setNewMachine] = useState({ name: '', description: '' });
  const [editedMachine, setEditedMachine] = useState<Machine | null>(null);
  const [selectedMachineDetails, setSelectedMachineDetails] = useState<Machine | null>(null);
  const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [eventFilters, setEventFilters] = useState({
    machineId: '',
    eventType: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const filteredMachines = machines.filter((machine) =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form verilerini topla ve API'ye gönder
    const formData = new FormData();
    formData.append('description', description);
    formData.append('workDone', workDone);
    formData.append('parts', parts);
    formData.append('cost', cost);
    files.forEach((file) => {
      formData.append('files', file);
    });
    console.log(formData); // Şimdilik sadece konsola yazdır
    // Formu resetle
    setDescription('');
    setWorkDone('');
    setParts('');
    setCost('');
    setFiles([]);
  };

  const openAddMachineModal = () => setIsAddMachineModalOpen(true);
  const closeAddMachineModal = () => {
    setIsAddMachineModalOpen(false);
    setNewMachine({ name: '', description: '' });
  };

  const openEditMachineModal = (machine: Machine) => {
    setEditedMachine(machine);
    setIsEditMachineModalOpen(true);
  };
  const closeEditMachineModal = () => {
    setIsEditMachineModalOpen(false);
    setEditedMachine(null);
  };

  const handleAddMachine = () => {
    // API'ye yeni makine gönder
    console.log('Yeni makine:', newMachine);
    closeAddMachineModal();
  };

  const handleEditMachine = () => {
    // API'ye düzenlenen makineyi gönder
    console.log('Düzenlenen makine:', editedMachine);
    closeEditMachineModal();
  };

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachineDetails(machine);
  };

  const handleAddMaintenance = () => {
    // API'ye yeni bakım kaydı gönder
    console.log('Yeni bakım:', {
      machineId: selectedMachineDetails?.id,
      description: maintenanceDescription,
      cost: maintenanceCost,
    });
    setMaintenanceDescription('');
    setMaintenanceCost('');
  };

  const openDetailsModal = (e: React.MouseEvent, machine: Machine) => {
    e.preventDefault();
    setSelectedMachine(machine);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedMachine(null);
  };

  const handleExportReport = () => {
    // Rapor oluştur ve indir
    console.log('Rapor oluşturuluyor...');
  };

  const filteredEvents = maintenanceEvents.filter(event => {
    if (eventFilters.machineId && event.machineId.toString() !== eventFilters.machineId) return false;
    if (eventFilters.eventType && event.eventType !== eventFilters.eventType) return false;
    if (eventFilters.status && event.status !== eventFilters.status) return false;
    if (eventFilters.startDate && event.date < eventFilters.startDate) return false;
    if (eventFilters.endDate && event.date > eventFilters.endDate) return false;
    return true;
  });

  // Takvim olaylarını oluştur
  const calendarEvents: CalendarEvent[] = maintenanceEvents.map(event => ({
    id: event.id.toString(),
    title: `${event.machineName} - ${
      event.eventType === 'maintenance' ? 'Bakım' :
      event.eventType === 'repair' ? 'Onarım' :
      event.eventType === 'breakdown' ? 'Arıza' :
      'Kontrol'
    }`,
    start: event.date,
    backgroundColor: 
      event.eventType === 'maintenance' ? '#10B981' :
      event.eventType === 'repair' ? '#F59E0B' :
      event.eventType === 'breakdown' ? '#EF4444' :
      '#6366F1',
    borderColor: 
      event.eventType === 'maintenance' ? '#059669' :
      event.eventType === 'repair' ? '#D97706' :
      event.eventType === 'breakdown' ? '#DC2626' :
      '#4F46E5',
    textColor: '#FFFFFF',
    extendedProps: {
      type: event.eventType,
      machineId: event.machineId,
      machineName: event.machineName,
      description: event.description,
      cost: event.cost,
      status: event.status,
      technician: event.technician
    }
  }));

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setIsEventModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Bakım & Onarım
          </h1>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={openAddMachineModal}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Yeni Makine Ekle
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Makine Adı
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Durum
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Son Bakım
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Sonraki Bakım
                      </th>
                      <th scope="col" className="relative px-6 py-3 whitespace-nowrap">
                        <span className="sr-only">Eylemler</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {machines.map((machine) => (
                      <tr 
                        key={machine.id} 
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleMachineClick(machine)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {machine.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            machine.status === 'normal' ? 'bg-green-100 text-green-800' :
                            machine.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {machine.status === 'normal' ? 'Normal' : 
                             machine.status === 'warning' ? 'Uyarı' : 
                             'Kritik'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {machine.lastMaintenance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {machine.nextMaintenance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              openEditMachineModal(machine);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Düzenle
                          </a>
                          <a 
                            href="#" 
                            onClick={(e) => openDetailsModal(e, machine)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Detaylar
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Machine Modal */}
      {isAddMachineModalOpen && (
        <Modal
          isOpen={isAddMachineModalOpen}
          onClose={closeAddMachineModal}
          title="Yeni Makine Ekle"
        >
          <div className="mt-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Makine Adı
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newMachine.name}
                  onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newMachine.description}
                  onChange={(e) => setNewMachine({ ...newMachine, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
              onClick={handleAddMachine}
            >
              Ekle
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
              onClick={closeAddMachineModal}
            >
              İptal
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Machine Modal */}
      {isEditMachineModalOpen && (
        <Modal
          isOpen={isEditMachineModalOpen}
          onClose={closeEditMachineModal}
          title="Makine Düzenle"
        >
          <div className="mt-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                  Makine Adı
                </label>
                <input
                  type="text"
                  name="edit-name"
                  id="edit-name"
                  value={editedMachine?.name || ''}
                  onChange={(e) => setEditedMachine(editedMachine ? { ...editedMachine, name: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                  Durum
                </label>
                <select
                  id="edit-status"
                  name="edit-status"
                  value={editedMachine?.status || ''}
                  onChange={(e) => setEditedMachine(editedMachine ? { ...editedMachine, status: e.target.value as 'normal' | 'warning' | 'critical' } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="warning">Uyarı</option>
                  <option value="critical">Kritik</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <textarea
                  id="edit-description"
                  name="edit-description"
                  rows={3}
                  value={editedMachine?.description || ''}
                  onChange={(e) => setEditedMachine(editedMachine ? { ...editedMachine, description: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
              onClick={handleEditMachine}
            >
              Kaydet
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
              onClick={closeEditMachineModal}
            >
              İptal
            </button>
          </div>
        </Modal>
      )}

      {/* Makine Detayları Modalı */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`${selectedMachine?.name || ''} Detayları`}
      >
        <div className="space-y-8">
          <div>
            <h4 className="text-base font-medium text-gray-900">Genel Bilgiler</h4>
            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Durum</dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-gray-900">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedMachine?.status === 'normal' ? 'bg-green-100 text-green-800' :
                    selectedMachine?.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    <span className={`h-2 w-2 rounded-full mr-2 ${
                      selectedMachine?.status === 'normal' ? 'bg-green-400' :
                      selectedMachine?.status === 'warning' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                    {selectedMachine?.status === 'normal' ? 'Normal' :
                     selectedMachine?.status === 'warning' ? 'Uyarı' :
                     'Kritik'}
                  </span>
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Son Bakım</dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-gray-900">
                  {selectedMachine?.lastMaintenance}
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Sonraki Bakım</dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-gray-900">
                  {selectedMachine?.nextMaintenance}
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-base font-medium text-gray-900">Makine Bilgileri</h4>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Model</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedMachine?.model || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Seri No</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedMachine?.serialNumber || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Üretici</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedMachine?.manufacturer || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Kurulum Tarihi</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedMachine?.installationDate || '-'}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900">Konum Bilgileri</h4>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lokasyon</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedMachine?.location || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Departman</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedMachine?.department || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-900">Bakım Geçmişi</h4>
            <div className="mt-4 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          Tarih
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Tür
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Açıklama
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Maliyet
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {maintenanceHistory
                        .filter(history => history.machineId === selectedMachine?.id)
                        .map((history) => (
                          <tr key={history.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {history.date}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                history.eventType === 'maintenance' ? 'bg-green-100 text-green-800' :
                                history.eventType === 'repair' ? 'bg-yellow-100 text-yellow-800' :
                                history.eventType === 'breakdown' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {history.eventType === 'maintenance' ? 'Bakım' :
                                 history.eventType === 'repair' ? 'Onarım' :
                                 history.eventType === 'breakdown' ? 'Arıza' :
                                 'Kontrol'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {history.description}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {history.cost} ₺
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                history.status === 'completed' ? 'bg-green-100 text-green-800' :
                                history.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {history.status === 'completed' ? 'Tamamlandı' :
                                 history.status === 'pending' ? 'Beklemede' :
                                 'Devam Ediyor'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-900">Yeni Bakım Ekle</h4>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maintenance-type" className="block text-sm font-medium text-gray-700">
                    Bakım Türü
                  </label>
                  <select
                    id="maintenance-type"
                    name="maintenance-type"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="maintenance">Planlı Bakım</option>
                    <option value="repair">Onarım</option>
                    <option value="breakdown">Arıza</option>
                    <option value="inspection">Kontrol</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="maintenance-priority" className="block text-sm font-medium text-gray-700">
                    Öncelik
                  </label>
                  <select
                    id="maintenance-priority"
                    name="maintenance-priority"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="maintenance-description" className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <textarea
                  id="maintenance-description"
                  name="maintenance-description"
                  rows={3}
                  value={maintenanceDescription}
                  onChange={(e) => setMaintenanceDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="maintenance-work" className="block text-sm font-medium text-gray-700">
                  Yapılan İşlemler
                </label>
                <textarea
                  id="maintenance-work"
                  name="maintenance-work"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kullanılan Parçalar
                </label>
                <div className="mt-2 space-y-2">
                  {/* Parça ekleme alanı */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Parça Adı"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Miktar"
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Maliyet"
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="maintenance-cost" className="block text-sm font-medium text-gray-700">
                  Toplam Maliyet
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">₺</span>
                  </div>
                  <input
                    type="text"
                    name="maintenance-cost"
                    id="maintenance-cost"
                    value={maintenanceCost}
                    onChange={(e) => setMaintenanceCost(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dosya Ekle
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Dosya Yükle</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">veya sürükleyip bırakın</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC 10MB'a kadar</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddMaintenance}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Bakım Ekle
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Events Table Section */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <h2 className="text-lg font-medium text-gray-900">Bakım & Onarım Olayları</h2>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => handleExportReport()}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
              Rapor İndir
            </button>
            <button
              onClick={() => setEventFilters({ machineId: '', eventType: '', startDate: '', endDate: '', status: '' })}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
              Filtreleri Temizle
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="machineFilter" className="block text-sm font-medium text-gray-700">Makine</label>
            <select
              id="machineFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={eventFilters.machineId}
              onChange={(e) => setEventFilters({ ...eventFilters, machineId: e.target.value })}
            >
              <option value="">Tümü</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>{machine.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700">Olay Tipi</label>
            <select
              id="typeFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={eventFilters.eventType}
              onChange={(e) => setEventFilters({ ...eventFilters, eventType: e.target.value })}
            >
              <option value="">Tümü</option>
              <option value="maintenance">Bakım</option>
              <option value="repair">Onarım</option>
              <option value="breakdown">Arıza</option>
              <option value="inspection">Kontrol</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
            <input
              type="date"
              id="startDate"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={eventFilters.startDate}
              onChange={(e) => setEventFilters({ ...eventFilters, startDate: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
            <input
              type="date"
              id="endDate"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={eventFilters.endDate}
              onChange={(e) => setEventFilters({ ...eventFilters, endDate: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Durum</label>
            <select
              id="statusFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={eventFilters.status}
              onChange={(e) => setEventFilters({ ...eventFilters, status: e.target.value })}
            >
              <option value="">Tümü</option>
              <option value="completed">Tamamlandı</option>
              <option value="pending">Beklemede</option>
              <option value="in_progress">Devam Ediyor</option>
            </select>
          </div>
        </div>

        {/* Events Table */}
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Makine
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Olay Tipi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Açıklama
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Tarih
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Maliyet
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Teknisyen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.machineName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.eventType === 'maintenance' && 'Bakım'}
                      {event.eventType === 'repair' && 'Onarım'}
                      {event.eventType === 'breakdown' && 'Arıza'}
                      {event.eventType === 'inspection' && 'Kontrol'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.cost} TL
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {event.status === 'completed' && 'Tamamlandı'}
                        {event.status === 'pending' && 'Beklemede'}
                        {event.status === 'in_progress' && 'Devam Ediyor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.technician}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Bakım & Onarım Takvimi</h2>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={trLocale}
                events={calendarEvents}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                buttonText={{
                  today: 'Bugün',
                  month: 'Ay',
                  week: 'Hafta'
                }}
                height="auto"
                contentHeight="auto"
                aspectRatio={1.5}
                handleWindowResize={true}
                views={{
                  dayGridMonth: {
                    titleFormat: { year: 'numeric', month: 'long' },
                    dayMaxEventRows: window.innerWidth < 768 ? 2 : 3
                  },
                  dayGridWeek: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Modal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          title="Olay Detayları"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Makine Bilgileri</h4>
              <p className="mt-2 text-sm text-gray-500">
                {selectedEvent.extendedProps.machineName}
              </p>
            </div>

            <div>
              <h4 className="text-base font-medium text-gray-900">Olay Tipi</h4>
              <p className="mt-2">
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                  selectedEvent.extendedProps.type === 'maintenance' ? 'bg-green-100 text-green-800' :
                  selectedEvent.extendedProps.type === 'repair' ? 'bg-yellow-100 text-yellow-800' :
                  selectedEvent.extendedProps.type === 'breakdown' ? 'bg-red-100 text-red-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {selectedEvent.extendedProps.type === 'maintenance' ? 'Bakım' :
                   selectedEvent.extendedProps.type === 'repair' ? 'Onarım' :
                   selectedEvent.extendedProps.type === 'breakdown' ? 'Arıza' :
                   'Kontrol'}
                </span>
              </p>
            </div>

            <div>
              <h4 className="text-base font-medium text-gray-900">Açıklama</h4>
              <p className="mt-2 text-sm text-gray-500">
                {selectedEvent.extendedProps.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">Tarih</h4>
                <p className="mt-2 text-sm text-gray-500">
                  {new Date(selectedEvent.start).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">Maliyet</h4>
                <p className="mt-2 text-sm text-gray-500">
                  {selectedEvent.extendedProps.cost} ₺
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">Durum</h4>
                <p className="mt-2">
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                    selectedEvent.extendedProps.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedEvent.extendedProps.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedEvent.extendedProps.status === 'completed' ? 'Tamamlandı' :
                     selectedEvent.extendedProps.status === 'pending' ? 'Beklemede' :
                     'Devam Ediyor'}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">Teknisyen</h4>
                <p className="mt-2 text-sm text-gray-500">
                  {selectedEvent.extendedProps.technician}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
} 