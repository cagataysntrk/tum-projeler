'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/Modal';
import {
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  TodayButton,
  Toolbar,
  ViewSwitcher
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LensIcon from '@mui/icons-material/Lens';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

interface Personnel {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'on_leave';
  role: 'admin' | 'manager' | 'technician' | 'operator';
  startDate: string;
  skills: string[];
  salary?: number;
  performanceScore?: number;
  shifts?: {
    day: string;
    startTime: string;
    endTime: string;
    type: 'morning' | 'evening' | 'night';
    isOvertime?: boolean;
  }[];
  attendance?: {
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'present' | 'absent' | 'late' | 'early_leave';
    overtime?: number;
    notes?: string;
  }[];
  certifications?: {
    name: string;
    issueDate: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'expiring_soon';
  }[];
  assignments?: {
    id: number;
    taskName: string;
    machineId?: number;
    machineName?: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    priority: 'low' | 'medium' | 'high';
    description?: string;
    requiredSkills?: string[];
    assignedBy?: string;
    completionNotes?: string;
  }[];
  performance?: {
    period: string;
    score: number;
    feedback: string;
    goals: string[];
    bonuses?: number;
    metrics: {
      category: string;
      score: number;
      weight: number;
      comments?: string;
    }[];
    developmentPlans?: {
      area: string;
      objectives: string[];
      timeline: string;
      status: 'not_started' | 'in_progress' | 'completed';
    }[];
  }[];
  permissions?: {
    canEditPersonnel: boolean;
    canViewSalary: boolean;
    canAssignTasks: boolean;
    canApproveLeave: boolean;
    canViewReports: boolean;
  };
  avatar?: string;
}

// Örnek personel verileri
const personnelData: Personnel[] = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@sirket.com',
    phone: '0532 123 4567',
    department: 'Bakım',
    position: 'Kıdemli Teknisyen',
    status: 'active',
    role: 'technician',
    startDate: '2020-03-15',
    salary: 15000,
    performanceScore: 85,
    skills: ['Elektrik', 'Mekanik', 'PLC'],
    certifications: [
      {
        name: 'İş Güvenliği Sertifikası',
        issueDate: '2021-01-15',
        expiryDate: '2024-01-15',
        status: 'active'
      }
    ],
    assignments: [
      {
        id: 1,
        taskName: 'CNC Makine Bakımı',
        machineId: 1,
        machineName: 'CNC-001',
        startDate: '2024-02-15 09:00',
        endDate: '2024-02-15 12:00',
        status: 'in_progress',
        priority: 'high',
        description: 'Aylık rutin bakım',
        requiredSkills: ['Mekanik', 'PLC'],
        assignedBy: 'Mehmet Demir',
        completionNotes: ''
      }
    ],
    performance: [
      {
        period: '2024-Q1',
        score: 85,
        feedback: 'Başarılı performans',
        goals: ['PLC eğitimi tamamlama', 'Bakım süresini %10 azaltma'],
        bonuses: 2000,
        metrics: [
          {
            category: 'Teknik Yetkinlik',
            score: 90,
            weight: 0.4,
            comments: 'PLC konusunda gelişim gösteriyor'
          },
          {
            category: 'İş Kalitesi',
            score: 85,
            weight: 0.3,
            comments: 'Bakım kalitesi yüksek'
          },
          {
            category: 'Zamanlama',
            score: 80,
            weight: 0.3,
            comments: 'Bakım sürelerinde iyileştirme gerekli'
          }
        ],
        developmentPlans: [
          {
            area: 'PLC Programlama',
            objectives: ['Temel eğitimi tamamlama', 'Proje geliştirme'],
            timeline: '2024-Q2',
            status: 'in_progress'
          }
        ]
      }
    ],
    shifts: [
      {
        day: '2024-02-15',
        startTime: '08:00',
        endTime: '16:00',
        type: 'morning',
        isOvertime: false
      }
    ],
    attendance: [
      {
        date: '2024-02-15',
        checkIn: '07:55',
        checkOut: '16:05',
        status: 'present',
        overtime: 0,
        notes: ''
      }
    ],
    permissions: {
      canEditPersonnel: false,
      canViewSalary: false,
      canAssignTasks: true,
      canApproveLeave: false,
      canViewReports: true
    },
    avatar: '/avatars/ahmet.jpg'
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    email: 'mehmet.demir@sirket.com',
    phone: '0533 234 5678',
    department: 'Üretim',
    position: 'Üretim Müdürü',
    status: 'active',
    role: 'manager',
    startDate: '2019-06-01',
    salary: 25000,
    performanceScore: 90,
    skills: ['Üretim Planlama', 'Kalite Kontrol', 'Lean Manufacturing'],
    assignments: [
      {
        id: 2,
        taskName: 'Üretim Planı Hazırlama',
        startDate: '2024-02-15 09:00',
        endDate: '2024-02-15 17:00',
        status: 'in_progress',
        priority: 'high',
        description: 'Haftalık üretim planı',
        assignedBy: 'Ali Kaya',
        completionNotes: ''
      }
    ],
    performance: [
      {
        period: '2024-Q1',
        score: 90,
        feedback: 'Mükemmel performans',
        goals: ['Üretim verimliliğini %5 artırma', 'Yeni ERP sistemine geçiş'],
        bonuses: 5000,
        metrics: [
          {
            category: 'Yönetim Becerileri',
            score: 95,
            weight: 0.4,
            comments: 'Ekip yönetimi başarılı'
          },
          {
            category: 'Verimlilik',
            score: 88,
            weight: 0.3,
            comments: 'Üretim hedeflerine ulaşıldı'
          },
          {
            category: 'İnovasyon',
            score: 85,
            weight: 0.3,
            comments: 'Süreç iyileştirme önerileri değerli'
          }
        ],
        developmentPlans: [
          {
            area: 'Dijital Dönüşüm',
            objectives: ['ERP sistem eğitimi', 'Dijital süreç optimizasyonu'],
            timeline: '2024-Q3',
            status: 'not_started'
          }
        ]
      }
    ],
    shifts: [
      {
        day: '2024-02-15',
        startTime: '09:00',
        endTime: '18:00',
        type: 'morning',
        isOvertime: false
      }
    ],
    attendance: [
      {
        date: '2024-02-15',
        checkIn: '08:45',
        checkOut: '18:15',
        status: 'present',
        overtime: 0.25,
        notes: 'Üretim planlaması için geç çıkış'
      }
    ],
    permissions: {
      canEditPersonnel: true,
      canViewSalary: true,
      canAssignTasks: true,
      canApproveLeave: true,
      canViewReports: true
    }
  }
];

// Görev durumlarına göre renk kodları
const taskStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800'
};

const taskPriorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

// Tablo başlıkları
const tableHeaders = [
  { id: 'personnel', label: 'Personel' },
  { id: 'department', label: 'Departman' },
  { id: 'position', label: 'Pozisyon' },
  { id: 'status', label: 'Durum' },
  { id: 'actions', label: 'İşlemler' }
];

export default function PersonnelPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: ''
  });
  const [newPersonnel, setNewPersonnel] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    role: '',
    skills: [] as string[],
    newSkill: '',
    shift: {
      type: 'morning' as 'morning' | 'evening' | 'night',
      startTime: '',
      endTime: ''
    },
    permissions: {
      canEditPersonnel: false,
      canViewSalary: false,
      canAssignTasks: false,
      canApproveLeave: false,
      canViewReports: false
    }
  });
  const [editedPersonnel, setEditedPersonnel] = useState<Personnel | null>(null);
  const [editSkill, setEditSkill] = useState('');
  const [showPerformance, setShowPerformance] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'gantt'>('list');

  // Filtreleme fonksiyonu
  const filteredPersonnel = personnelData.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !filters.department || person.department === filters.department;
    const matchesRole = !filters.role || person.role === filters.role;
    const matchesStatus = !filters.status || person.status === filters.status;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // Yetenek ekleme fonksiyonu
  const handleAddSkill = () => {
    if (newPersonnel.newSkill.trim() && !newPersonnel.skills.includes(newPersonnel.newSkill.trim())) {
      setNewPersonnel({
        ...newPersonnel,
        skills: [...newPersonnel.skills, newPersonnel.newSkill.trim()],
        newSkill: ''
      });
    }
  };

  // Yetenek silme fonksiyonu
  const handleRemoveSkill = (skillToRemove: string) => {
    setNewPersonnel({
      ...newPersonnel,
      skills: newPersonnel.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Personel ekleme fonksiyonu
  const handleAddPersonnel = () => {
    // API'ye yeni personel verisi gönderilecek
    const newPersonnelData: Partial<Personnel> = {
      name: newPersonnel.name,
      email: newPersonnel.email,
      phone: newPersonnel.phone,
      department: newPersonnel.department,
      position: newPersonnel.position,
      role: newPersonnel.role as Personnel['role'],
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      skills: newPersonnel.skills,
      shifts: [{
        day: new Date().toISOString().split('T')[0],
        startTime: newPersonnel.shift.startTime,
        endTime: newPersonnel.shift.endTime,
        type: newPersonnel.shift.type
      }],
      permissions: newPersonnel.permissions
    };

    console.log('Yeni personel:', newPersonnelData);
    setIsAddModalOpen(false);
    setNewPersonnel({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      role: '',
      skills: [],
      newSkill: '',
      shift: {
        type: 'morning',
        startTime: '',
        endTime: ''
      },
      permissions: {
        canEditPersonnel: false,
        canViewSalary: false,
        canAssignTasks: false,
        canApproveLeave: false,
        canViewReports: false
      }
    });
  };

  // Personel düzenleme fonksiyonu
  const handleEditPersonnel = () => {
    if (!editedPersonnel) return;

    // API'ye düzenlenen personel verisi gönderilecek
    console.log('Düzenlenen personel:', editedPersonnel);
    setIsEditModalOpen(false);
    setEditedPersonnel(null);
  };

  // Görevleri takvim formatına dönüştür
  const getSchedulerData = () => {
    return personnelData.flatMap(person =>
      (person.assignments || []).map(assignment => ({
        id: assignment.id,
        title: `${person.name} - ${assignment.taskName}`,
        startDate: new Date(assignment.startDate),
        endDate: new Date(assignment.endDate),
        personId: person.id,
        status: assignment.status,
        priority: assignment.priority,
        machine: assignment.machineName,
        description: assignment.description
      }))
    );
  };

  // Yetenek düzenleme fonksiyonları
  const handleEditSkill = () => {
    if (editSkill.trim() && editedPersonnel && !editedPersonnel.skills.includes(editSkill.trim())) {
      setEditedPersonnel({
        ...editedPersonnel,
        skills: [...editedPersonnel.skills, editSkill.trim()]
      });
      setEditSkill('');
    }
  };

  const handleRemoveEditSkill = (skillToRemove: string) => {
    if (editedPersonnel) {
      setEditedPersonnel({
        ...editedPersonnel,
        skills: editedPersonnel.skills.filter(skill => skill !== skillToRemove)
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        {/* Başlık ve Arama - Responsive düzenleme */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Personel Yönetimi
          </h1>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <div className="relative flex items-center flex-1 sm:min-w-[300px]">
              <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Personel ara..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Yeni Personel
            </button>
          </div>
        </div>

        {/* Filtreler - Responsive düzenleme */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Departman
            </label>
            <select
              id="department"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Tümü</option>
              <option value="Bakım">Bakım</option>
              <option value="Üretim">Üretim</option>
              <option value="Kalite">Kalite</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="role"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Tümü</option>
              <option value="admin">Yönetici</option>
              <option value="manager">Müdür</option>
              <option value="technician">Teknisyen</option>
              <option value="operator">Operatör</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Durum
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Tümü</option>
              <option value="active">Aktif</option>
              <option value="inactive">İnaktif</option>
              <option value="on_leave">İzinde</option>
            </select>
          </div>
        </div>

        {/* Personel Listesi - Responsive düzenleme */}
        <div className="flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <div className="min-w-full divide-y divide-gray-300">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        {tableHeaders.map((header) => (
                          <th
                            key={header.id}
                            scope="col"
                            className={`py-3.5 text-left text-sm font-semibold text-gray-900 ${
                              header.id === 'personnel' ? 'pl-4 pr-3 sm:pl-6' :
                              header.id === 'actions' ? 'relative pl-3 pr-4 sm:pr-6' :
                              'px-3'
                            }`}
                          >
                            {header.id === 'actions' ? (
                              <span className="sr-only">{header.label}</span>
                            ) : (
                              header.label
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredPersonnel.map((person) => (
                        <tr
                          key={person.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {person.avatar ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={person.avatar}
                                    alt=""
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-800 font-medium text-sm">
                                      {person.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{person.name}</div>
                                <div className="text-gray-500">{person.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {person.department}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {person.position}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              person.status === 'active' ? 'bg-green-100 text-green-800' :
                              person.status === 'inactive' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {person.status === 'active' ? 'Aktif' :
                               person.status === 'inactive' ? 'İnaktif' :
                               'İzinde'}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={() => {
                                  setSelectedPersonnel(person);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                              >
                                Detaylar
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPersonnel(person);
                                  setEditedPersonnel(person);
                                  setIsEditModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                              >
                                Düzenle
                              </button>
                            </div>
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

        {/* Boş durum gösterimi */}
        {filteredPersonnel.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Personel bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Yeni bir personel ekleyebilir veya arama kriterlerini değiştirebilirsiniz.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Yeni Personel Ekle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Görev Takibi Bölümü */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-gray-900">Görev Takibi</h2>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`relative -ml-px inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                  viewMode === 'calendar'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Takvim
              </button>
              <button
                onClick={() => setViewMode('gantt')}
                className={`relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  viewMode === 'gantt'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Gantt
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {viewMode === 'calendar' && (
            <div className="bg-white shadow rounded-lg p-4">
              <Scheduler
                data={getSchedulerData()}
                height={600}
              >
                <ViewState
                  defaultCurrentDate={selectedDate}
                  onCurrentDateChange={setSelectedDate}
                />
                <DayView
                  startDayHour={8}
                  endDayHour={20}
                />
                <WeekView
                  startDayHour={8}
                  endDayHour={20}
                />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <ViewSwitcher />
                <Appointments />
                <AppointmentTooltip
                  contentComponent={({ appointmentData }) => {
                    if (!appointmentData) return null;
                    return (
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">{appointmentData.title}</h3>
                        {appointmentData.machine && (
                          <p className="mt-2 text-sm text-gray-500">
                            Makine: {appointmentData.machine}
                          </p>
                        )}
                        {appointmentData.description && (
                          <p className="mt-2 text-sm text-gray-500">
                            {appointmentData.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center space-x-2">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            taskStatusColors[appointmentData.status as keyof typeof taskStatusColors]
                          }`}>
                            {appointmentData.status === 'pending' ? 'Beklemede' :
                             appointmentData.status === 'in_progress' ? 'Devam Ediyor' :
                             appointmentData.status === 'completed' ? 'Tamamlandı' :
                             'Gecikmiş'}
                          </span>
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            taskPriorityColors[appointmentData.priority as keyof typeof taskPriorityColors]
                          }`}>
                            {appointmentData.priority === 'low' ? 'Düşük' :
                             appointmentData.priority === 'medium' ? 'Orta' :
                             'Yüksek'} Öncelik
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
              </Scheduler>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {personnelData.flatMap(person =>
                  (person.assignments || []).map(assignment => (
                    <li key={`${person.id}-${assignment.id}`}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {person.avatar ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={person.avatar}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-indigo-800 font-medium text-sm">
                                    {person.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900">
                                {person.name} - {assignment.taskName}
                              </h4>
                              {assignment.machineName && (
                                <p className="text-sm text-gray-500">
                                  Makine: {assignment.machineName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              taskStatusColors[assignment.status]
                            }`}>
                              {assignment.status === 'pending' ? 'Beklemede' :
                               assignment.status === 'in_progress' ? 'Devam Ediyor' :
                               assignment.status === 'completed' ? 'Tamamlandı' :
                               'Gecikmiş'}
                            </span>
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              taskPriorityColors[assignment.priority]
                            }`}>
                              {assignment.priority === 'low' ? 'Düşük' :
                               assignment.priority === 'medium' ? 'Orta' :
                               'Yüksek'} Öncelik
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Başlangıç: {new Date(assignment.startDate).toLocaleString()}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Bitiş: {new Date(assignment.endDate).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {viewMode === 'gantt' && (
            <div className="bg-white shadow rounded-lg p-4">
              {/* Gantt görünümü için özel bir bileşen eklenecek */}
              <p className="text-center text-gray-500">Gantt görünümü yakında eklenecek</p>
            </div>
          )}
        </div>
      </div>

      {/* Personel Ekleme Modalı */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yeni Personel Ekle"
      >
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                value={newPersonnel.name}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={newPersonnel.email}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                type="tel"
                id="phone"
                value={newPersonnel.phone}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Departman
              </label>
              <select
                id="department"
                value={newPersonnel.department}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, department: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Seçiniz...</option>
                <option value="Bakım">Bakım</option>
                <option value="Üretim">Üretim</option>
                <option value="Kalite">Kalite</option>
              </select>
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Pozisyon
              </label>
              <input
                type="text"
                id="position"
                value={newPersonnel.position}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, position: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                id="role"
                value={newPersonnel.role}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, role: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Seçiniz...</option>
                <option value="admin">Yönetici</option>
                <option value="manager">Müdür</option>
                <option value="technician">Teknisyen</option>
                <option value="operator">Operatör</option>
              </select>
            </div>
          </div>

          {/* Vardiya Bilgileri */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">Vardiya Bilgileri</h4>
            <div className="mt-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
              <div>
                <label htmlFor="shift-type" className="block text-sm font-medium text-gray-700">
                  Vardiya Tipi
                </label>
                <select
                  id="shift-type"
                  value={newPersonnel.shift.type}
                  onChange={(e) => setNewPersonnel({
                    ...newPersonnel,
                    shift: { ...newPersonnel.shift, type: e.target.value as 'morning' | 'evening' | 'night' }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="morning">Sabah</option>
                  <option value="evening">Akşam</option>
                  <option value="night">Gece</option>
                </select>
              </div>
              <div>
                <label htmlFor="shift-start" className="block text-sm font-medium text-gray-700">
                  Başlangıç Saati
                </label>
                <input
                  type="time"
                  id="shift-start"
                  value={newPersonnel.shift.startTime}
                  onChange={(e) => setNewPersonnel({
                    ...newPersonnel,
                    shift: { ...newPersonnel.shift, startTime: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="shift-end" className="block text-sm font-medium text-gray-700">
                  Bitiş Saati
                </label>
                <input
                  type="time"
                  id="shift-end"
                  value={newPersonnel.shift.endTime}
                  onChange={(e) => setNewPersonnel({
                    ...newPersonnel,
                    shift: { ...newPersonnel.shift, endTime: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Yetenekler */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">Yetenekler</h4>
            <div className="mt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPersonnel.newSkill}
                  onChange={(e) => setNewPersonnel({ ...newPersonnel, newSkill: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Yeni yetenek ekle"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ekle
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {newPersonnel.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                    >
                      <span className="sr-only">Kaldır</span>
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Yetkiler */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">Yetkiler</h4>
            <div className="mt-2 space-y-4">
              <div className="flex items-center">
                <input
                  id="can-edit-personnel"
                  type="checkbox"
                  checked={newPersonnel.permissions.canEditPersonnel}
                  onChange={(e) => setNewPersonnel({
                    ...newPersonnel,
                    permissions: { ...newPersonnel.permissions, canEditPersonnel: e.target.checked }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="can-edit-personnel" className="ml-2 block text-sm text-gray-900">
                  Personel düzenleme yetkisi
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="can-view-salary"
                  type="checkbox"
                  checked={newPersonnel.permissions.canViewSalary}
                  onChange={(e) => setNewPersonnel({
                    ...newPersonnel,
                    permissions: { ...newPersonnel.permissions, canViewSalary: e.target.checked }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="can-view-salary" className="ml-2 block text-sm text-gray-900">
                  Maaş görüntüleme yetkisi
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="can-assign-tasks"
                  type="checkbox"
                  checked={newPersonnel.permissions.canAssignTasks}
                  onChange={(e) => setNewPersonnel({
                    ...newPersonnel,
                    permissions: { ...newPersonnel.permissions, canAssignTasks: e.target.checked }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="can-assign-tasks" className="ml-2 block text-sm text-gray-900">
                  Görev atama yetkisi
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="can-approve-leave"
                  type="checkbox"
                  checked={newPersonnel.permissions.canApproveLeave}
                  onChange={(e) => setNewPersonnel({
                    ...newPersonnel,
                    permissions: { ...newPersonnel.permissions, canApproveLeave: e.target.checked }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="can-approve-leave" className="ml-2 block text-sm text-gray-900">
                  İzin onaylama yetkisi
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="can-view-reports"
                  type="checkbox"
                  checked={newPersonnel.permissions.canViewReports}
                  onChange={(e) => setNewPersonnel({
                    ...newPersonnel,
                    permissions: { ...newPersonnel.permissions, canViewReports: e.target.checked }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="can-view-reports" className="ml-2 block text-sm text-gray-900">
                  Rapor görüntüleme yetkisi
                </label>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={handleAddPersonnel}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
            >
              Ekle
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            >
              İptal
            </button>
          </div>
        </div>
      </Modal>

      {/* Personel Düzenleme Modalı */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditedPersonnel(null);
        }}
        title="Personel Düzenle"
      >
        {editedPersonnel && (
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="edit-name"
                  value={editedPersonnel.name}
                  onChange={(e) => setEditedPersonnel({ ...editedPersonnel, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <input
                  type="email"
                  id="edit-email"
                  value={editedPersonnel.email}
                  onChange={(e) => setEditedPersonnel({ ...editedPersonnel, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="edit-phone"
                  value={editedPersonnel.phone}
                  onChange={(e) => setEditedPersonnel({ ...editedPersonnel, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">
                  Departman
                </label>
                <select
                  id="edit-department"
                  value={editedPersonnel.department}
                  onChange={(e) => setEditedPersonnel({ ...editedPersonnel, department: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="Bakım">Bakım</option>
                  <option value="Üretim">Üretim</option>
                  <option value="Kalite">Kalite</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-position" className="block text-sm font-medium text-gray-700">
                  Pozisyon
                </label>
                <input
                  type="text"
                  id="edit-position"
                  value={editedPersonnel.position}
                  onChange={(e) => setEditedPersonnel({ ...editedPersonnel, position: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="edit-role"
                  value={editedPersonnel.role}
                  onChange={(e) => setEditedPersonnel({ ...editedPersonnel, role: e.target.value as Personnel['role'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="admin">Yönetici</option>
                  <option value="manager">Müdür</option>
                  <option value="technician">Teknisyen</option>
                  <option value="operator">Operatör</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                  Durum
                </label>
                <select
                  id="edit-status"
                  value={editedPersonnel.status}
                  onChange={(e) => setEditedPersonnel({ ...editedPersonnel, status: e.target.value as Personnel['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">İnaktif</option>
                  <option value="on_leave">İzinde</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Yetenekler
              </label>
              <div className="mt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editSkill}
                    onChange={(e) => setEditSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEditSkill()}
                    placeholder="Yeni yetenek ekle..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleEditSkill}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Ekle
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editedPersonnel.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveEditSkill(skill)}
                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                      >
                        <span className="sr-only">Kaldır</span>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={handleEditPersonnel}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditedPersonnel(null);
                }}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Personel Detay Modalı */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPersonnel(null);
        }}
        title={`${selectedPersonnel?.name || ''} - Personel Detayları`}
      >
        {selectedPersonnel && (
          <div className="mt-4 space-y-8">
            {/* Profil ve Temel Bilgiler */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {selectedPersonnel.avatar ? (
                  <img
                    className="h-24 w-24 rounded-lg object-cover"
                    src={selectedPersonnel.avatar}
                    alt={selectedPersonnel.name}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-medium text-2xl">
                      {selectedPersonnel.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-gray-900">{selectedPersonnel.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{selectedPersonnel.position}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    selectedPersonnel.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedPersonnel.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedPersonnel.status === 'active' ? 'Aktif' :
                     selectedPersonnel.status === 'inactive' ? 'İnaktif' :
                     'İzinde'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Başlangıç: {selectedPersonnel.startDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Vardiya ve Devam Durumu */}
            <div>
              <h4 className="text-base font-medium text-gray-900">Vardiya ve Devam Durumu</h4>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Güncel Vardiya */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h5 className="text-sm font-medium text-gray-900">Güncel Vardiya</h5>
                    {selectedPersonnel.shifts && selectedPersonnel.shifts[0] && (
                      <dl className="mt-2 grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Vardiya Tipi</dt>
                          <dd className="text-sm text-gray-900">
                            {selectedPersonnel.shifts[0].type === 'morning' ? 'Sabah' :
                             selectedPersonnel.shifts[0].type === 'evening' ? 'Akşam' :
                             'Gece'}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Başlangıç</dt>
                          <dd className="text-sm text-gray-900">{selectedPersonnel.shifts[0].startTime}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Bitiş</dt>
                          <dd className="text-sm text-gray-900">{selectedPersonnel.shifts[0].endTime}</dd>
                        </div>
                        {selectedPersonnel.shifts[0].isOvertime && (
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Mesai Durumu</dt>
                            <dd className="text-sm text-green-600">Mesaide</dd>
                          </div>
                        )}
                      </dl>
                    )}
                  </div>
                </div>

                {/* Son Giriş-Çıkış */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h5 className="text-sm font-medium text-gray-900">Son Giriş-Çıkış</h5>
                    {selectedPersonnel.attendance && selectedPersonnel.attendance[0] && (
                      <dl className="mt-2 grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Tarih</dt>
                          <dd className="text-sm text-gray-900">{selectedPersonnel.attendance[0].date}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Giriş</dt>
                          <dd className="text-sm text-gray-900">{selectedPersonnel.attendance[0].checkIn}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Çıkış</dt>
                          <dd className="text-sm text-gray-900">{selectedPersonnel.attendance[0].checkOut}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Durum</dt>
                          <dd className={`text-sm ${
                            selectedPersonnel.attendance[0].status === 'present' ? 'text-green-600' :
                            selectedPersonnel.attendance[0].status === 'absent' ? 'text-red-600' :
                            selectedPersonnel.attendance[0].status === 'late' ? 'text-yellow-600' :
                            'text-orange-600'
                          }`}>
                            {selectedPersonnel.attendance[0].status === 'present' ? 'Mevcut' :
                             selectedPersonnel.attendance[0].status === 'absent' ? 'Yok' :
                             selectedPersonnel.attendance[0].status === 'late' ? 'Geç Geldi' :
                             'Erken Çıktı'}
                          </dd>
                        </div>
                        {selectedPersonnel.attendance?.[0]?.overtime && selectedPersonnel.attendance[0].overtime > 0 && (
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Fazla Mesai</dt>
                            <dd className="text-sm text-green-600">
                              {selectedPersonnel.attendance[0].overtime} saat
                            </dd>
                          </div>
                        )}
                      </dl>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Performans Değerlendirmesi */}
            {selectedPersonnel.performance && selectedPersonnel.performance.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium text-gray-900">Performans Değerlendirmesi</h4>
                  <button
                    type="button"
                    onClick={() => setShowPerformance(!showPerformance)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    {showPerformance ? 'Gizle' : 'Göster'}
                  </button>
                </div>
                {showPerformance && (
                  <div className="mt-4 space-y-6">
                    {selectedPersonnel.performance.map((perf, index) => (
                      <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h5 className="text-lg font-medium text-gray-900">{perf.period}</h5>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              perf.score >= 90 ? 'bg-green-100 text-green-800' :
                              perf.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {perf.score} Puan
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">Geri Bildirim</dt>
                              <dd className="mt-1 text-sm text-gray-900">{perf.feedback}</dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">Hedefler</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                <ul className="list-disc pl-5 space-y-1">
                                  {perf.goals.map((goal, idx) => (
                                    <li key={idx}>{goal}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">Performans Metrikleri</dt>
                              <dd className="mt-2">
                                <div className="space-y-3">
                                  {perf.metrics.map((metric, idx) => (
                                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900">
                                          {metric.category}
                                        </span>
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                          metric.score >= 90 ? 'bg-green-100 text-green-800' :
                                          metric.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                          {metric.score} Puan
                                        </span>
                                      </div>
                                      {metric.comments && (
                                        <p className="mt-1 text-sm text-gray-600">{metric.comments}</p>
                                      )}
                                      <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                        <div
                                          className={`h-2 rounded-full ${
                                            metric.score >= 90 ? 'bg-green-500' :
                                            metric.score >= 70 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                          }`}
                                          style={{ width: `${metric.score}%` }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </dd>
                            </div>
                            {perf.developmentPlans && perf.developmentPlans.length > 0 && (
                              <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Gelişim Planları</dt>
                                <dd className="mt-2">
                                  <div className="space-y-4">
                                    {perf.developmentPlans.map((plan, idx) => (
                                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-900">{plan.area}</h6>
                                            <p className="mt-1 text-sm text-gray-600">
                                              Hedef Tarih: {plan.timeline}
                                            </p>
                                          </div>
                                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                            plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            plan.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                          }`}>
                                            {plan.status === 'completed' ? 'Tamamlandı' :
                                             plan.status === 'in_progress' ? 'Devam Ediyor' :
                                             'Başlanmadı'}
                                          </span>
                                        </div>
                                        <ul className="mt-2 list-disc pl-5 space-y-1">
                                          {plan.objectives.map((objective, objIdx) => (
                                            <li key={objIdx} className="text-sm text-gray-600">
                                              {objective}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Görev ve Makine Atamaları */}
            {selectedPersonnel.assignments && selectedPersonnel.assignments.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-gray-900">Görev ve Makine Atamaları</h4>
                <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Görev
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Makine
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Başlangıç
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Bitiş
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Durum
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Öncelik
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {selectedPersonnel.assignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {assignment.taskName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {assignment.machineName || '-'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {assignment.startDate}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {assignment.endDate}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                              assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              assignment.status === 'delayed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assignment.status === 'completed' ? 'Tamamlandı' :
                               assignment.status === 'in_progress' ? 'Devam Ediyor' :
                               assignment.status === 'delayed' ? 'Gecikmiş' :
                               'Beklemede'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                              assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                              assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {assignment.priority === 'high' ? 'Yüksek' :
                               assignment.priority === 'medium' ? 'Orta' :
                               'Düşük'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Yetkiler */}
            {selectedPersonnel.permissions && (
              <div>
                <h4 className="text-base font-medium text-gray-900">Yetkiler</h4>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className={`flex items-center p-4 bg-white rounded-lg shadow ${
                    selectedPersonnel.permissions.canEditPersonnel ? 'border-green-500' : 'border-gray-200'
                  } border-2`}>
                    <div className={`flex-shrink-0 w-8 h-8 mr-3 rounded-full flex items-center justify-center ${
                      selectedPersonnel.permissions.canEditPersonnel ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg
                        className={`w-5 h-5 ${
                          selectedPersonnel.permissions.canEditPersonnel ? 'text-green-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Personel Düzenleme</p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonnel.permissions.canEditPersonnel ? 'İzin var' : 'İzin yok'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center p-4 bg-white rounded-lg shadow ${
                    selectedPersonnel.permissions.canViewSalary ? 'border-green-500' : 'border-gray-200'
                  } border-2`}>
                    <div className={`flex-shrink-0 w-8 h-8 mr-3 rounded-full flex items-center justify-center ${
                      selectedPersonnel.permissions.canViewSalary ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg
                        className={`w-5 h-5 ${
                          selectedPersonnel.permissions.canViewSalary ? 'text-green-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Maaş Görüntüleme</p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonnel.permissions.canViewSalary ? 'İzin var' : 'İzin yok'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center p-4 bg-white rounded-lg shadow ${
                    selectedPersonnel.permissions.canAssignTasks ? 'border-green-500' : 'border-gray-200'
                  } border-2`}>
                    <div className={`flex-shrink-0 w-8 h-8 mr-3 rounded-full flex items-center justify-center ${
                      selectedPersonnel.permissions.canAssignTasks ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg
                        className={`w-5 h-5 ${
                          selectedPersonnel.permissions.canAssignTasks ? 'text-green-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Görev Atama</p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonnel.permissions.canAssignTasks ? 'İzin var' : 'İzin yok'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center p-4 bg-white rounded-lg shadow ${
                    selectedPersonnel.permissions.canApproveLeave ? 'border-green-500' : 'border-gray-200'
                  } border-2`}>
                    <div className={`flex-shrink-0 w-8 h-8 mr-3 rounded-full flex items-center justify-center ${
                      selectedPersonnel.permissions.canApproveLeave ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg
                        className={`w-5 h-5 ${
                          selectedPersonnel.permissions.canApproveLeave ? 'text-green-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">İzin Onaylama</p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonnel.permissions.canApproveLeave ? 'İzin var' : 'İzin yok'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center p-4 bg-white rounded-lg shadow ${
                    selectedPersonnel.permissions.canViewReports ? 'border-green-500' : 'border-gray-200'
                  } border-2`}>
                    <div className={`flex-shrink-0 w-8 h-8 mr-3 rounded-full flex items-center justify-center ${
                      selectedPersonnel.permissions.canViewReports ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg
                        className={`w-5 h-5 ${
                          selectedPersonnel.permissions.canViewReports ? 'text-green-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Rapor Görüntüleme</p>
                      <p className="text-sm text-gray-500">
                        {selectedPersonnel.permissions.canViewReports ? 'İzin var' : 'İzin yok'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
} 