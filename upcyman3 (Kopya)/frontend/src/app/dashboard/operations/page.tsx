'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OperationForm from '@/components/operations/OperationForm';
import OperationSummary from '@/components/operations/OperationSummary';
import { 
  ArrowPathIcon, 
  BeakerIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

// Operasyon türleri
export type OperationType = 'sorting' | 'compression' | 'recycling' | 'cleaning' | 'shredding';

// Makine durumu
export type MachineStatus = 'available' | 'in_use' | 'maintenance' | 'error';

// Makine bilgisi
export interface Machine {
  id: string;
  name: string;
  type: string;
  status: MachineStatus;
  lastMaintenance: string;
  nextMaintenance: string;
}

// Operasyon verisi
export interface OperationData {
  id: string;
  type: OperationType;
  machineId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  inputAmount: number;
  outputAmount: number;
  qualityLevel: 'A' | 'B' | 'C';
  operatorNotes: string;
  attachments?: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

// Örnek makine verileri
const mockMachines: Machine[] = [
  {
    id: '1',
    name: 'Ayırma Bandı 1',
    type: 'sorting',
    status: 'available',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-03-01'
  },
  {
    id: '2',
    name: 'Pres 1',
    type: 'compression',
    status: 'in_use',
    lastMaintenance: '2024-02-05',
    nextMaintenance: '2024-03-05'
  },
  {
    id: '3',
    name: 'Kırma Makinesi 1',
    type: 'shredding',
    status: 'maintenance',
    lastMaintenance: '2024-02-10',
    nextMaintenance: '2024-02-12'
  }
];

export default function OperationsPage() {
  const [activeOperation, setActiveOperation] = useState<OperationData | null>(null);
  const [machines] = useState<Machine[]>(mockMachines);

  const handleOperationSubmit = (data: Omit<OperationData, 'id'>) => {
    // API'ye gönderilecek
    console.log('Yeni operasyon:', data);
  };

  return (
    <DashboardLayout>
      <div className="py-6 space-y-8">
        {/* Başlık */}
        <div className="flex items-center justify-between">
          <h1 className="text-heading-2 font-bold text-gray-900">
            Operasyon Yönetimi
          </h1>
        </div>

        {/* Durum Kartları */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Aktif Operasyonlar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowPathIcon className="h-6 w-6 text-brand-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Aktif Operasyonlar
                </h3>
                <p className="text-2xl font-semibold text-brand-blue-600">3</p>
              </div>
            </div>
          </div>

          {/* Günlük İşlenen */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BeakerIcon className="h-6 w-6 text-brand-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Günlük İşlenen
                </h3>
                <p className="text-2xl font-semibold text-brand-green-600">2.450 kg</p>
              </div>
            </div>
          </div>

          {/* Ortalama Süre */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-brand-blue-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Ortalama Süre
                </h3>
                <p className="text-2xl font-semibold text-brand-blue-800">45 dk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Operasyon Formu */}
          <div className="lg:col-span-2">
            <OperationForm 
              machines={machines}
              onSubmit={handleOperationSubmit}
            />
          </div>

          {/* Özet Panel */}
          <div>
            <OperationSummary 
              operation={activeOperation}
              machines={machines}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 