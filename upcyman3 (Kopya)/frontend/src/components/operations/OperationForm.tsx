'use client';

import { useState, useRef } from 'react';
import { 
  ArrowPathIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ArrowsUpDownIcon,
  SparklesIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import type { Machine, OperationType, OperationData } from '@/app/dashboard/operations/page';

interface OperationFormProps {
  machines: Machine[];
  onSubmit: (data: Omit<OperationData, 'id'>) => void;
}

const operationTypes = [
  {
    id: 'sorting' as OperationType,
    name: 'Malzeme Ayırma',
    icon: <ArrowsUpDownIcon className="h-6 w-6" />,
    description: 'Farklı malzemelerin türlerine göre ayrıştırılması'
  },
  {
    id: 'compression' as OperationType,
    name: 'Sıkıştırma',
    icon: <ArrowPathIcon className="h-6 w-6" />,
    description: 'Malzemelerin hacmini azaltmak için sıkıştırma'
  },
  {
    id: 'recycling' as OperationType,
    name: 'Geri Dönüşüm',
    icon: <BeakerIcon className="h-6 w-6" />,
    description: 'Malzemelerin geri dönüştürülmesi'
  },
  {
    id: 'cleaning' as OperationType,
    name: 'Temizleme',
    icon: <SparklesIcon className="h-6 w-6" />,
    description: 'Malzemelerin temizlenmesi ve hazırlanması'
  },
  {
    id: 'shredding' as OperationType,
    name: 'Parçalama',
    icon: <WrenchScrewdriverIcon className="h-6 w-6" />,
    description: 'Malzemelerin küçük parçalara ayrılması'
  }
];

export default function OperationForm({ machines, onSubmit }: OperationFormProps) {
  const [selectedType, setSelectedType] = useState<OperationType | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [outputAmount, setOutputAmount] = useState<string>('');
  const [qualityLevel, setQualityLevel] = useState<'A' | 'B' | 'C'>('A');
  const [notes, setNotes] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !selectedMachine) {
      alert('Lütfen işlem türü ve makine seçiniz');
      return;
    }

    const operationData: Omit<OperationData, 'id'> = {
      type: selectedType,
      machineId: selectedMachine,
      startTime: new Date().toISOString(),
      duration: parseInt(duration),
      inputAmount: parseFloat(inputAmount),
      outputAmount: parseFloat(outputAmount),
      qualityLevel,
      operatorNotes: notes,
      attachments: [],
      status: 'in_progress'
    };

    onSubmit(operationData);
  };

  const getMachineStatusColor = (status: Machine['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_use':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMachineStatusText = (status: Machine['status']) => {
    switch (status) {
      case 'available':
        return 'Kullanılabilir';
      case 'in_use':
        return 'Kullanımda';
      case 'maintenance':
        return 'Bakımda';
      case 'error':
        return 'Arızalı';
      default:
        return status;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-medium text-gray-900">
        Yeni Operasyon Başlat
      </h2>

      {/* İşlem Türü Seçimi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          İşlem Türü
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {operationTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id)}
              className={`${
                selectedType === type.id
                  ? 'bg-brand-green-50 border-brand-green-500 ring-2 ring-brand-green-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              } p-4 border rounded-lg flex flex-col items-center text-center transition-colors`}
            >
              <div className={`${
                selectedType === type.id ? 'text-brand-green-500' : 'text-gray-500'
              }`}>
                {type.icon}
              </div>
              <span className="mt-2 font-medium text-gray-900">{type.name}</span>
              <span className="mt-1 text-sm text-gray-500">{type.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Makine Seçimi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Makine Seçimi
        </label>
        <div className="space-y-2">
          {machines.map((machine) => (
            <label
              key={machine.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMachine === machine.id
                  ? 'bg-brand-green-50 border-brand-green-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="machine"
                value={machine.id}
                checked={selectedMachine === machine.id}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="text-brand-green-500 focus:ring-brand-green-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {machine.name}
                  </span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMachineStatusColor(machine.status)}`}>
                    {getMachineStatusText(machine.status)}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Son Bakım: {machine.lastMaintenance} | Sonraki Bakım: {machine.nextMaintenance}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Süre ve Miktar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Çalışma Süresi (dk)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giriş Miktarı (kg)
          </label>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Çıkış Miktarı (kg)
          </label>
          <input
            type="number"
            value={outputAmount}
            onChange={(e) => setOutputAmount(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Kalite Seviyesi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kalite Seviyesi
        </label>
        <div className="flex space-x-4">
          {['A', 'B', 'C'].map((level) => (
            <label
              key={level}
              className={`flex-1 flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                qualityLevel === level
                  ? 'bg-brand-green-50 border-brand-green-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="quality"
                value={level}
                checked={qualityLevel === level}
                onChange={(e) => setQualityLevel(e.target.value as 'A' | 'B' | 'C')}
                className="sr-only"
              />
              <span className={`text-lg font-medium ${
                qualityLevel === level ? 'text-brand-green-700' : 'text-gray-700'
              }`}>
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Notlar ve Ekler */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Operatör Notları
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
          placeholder="İşlemle ilgili notlarınızı buraya yazabilirsiniz..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ekler
        </label>
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            className="hidden"
            onChange={(e) => {
              // Dosya yükleme işlemleri
              console.log('Seçilen dosyalar:', e.target.files);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentArrowUpIcon className="h-5 w-5 mr-2 text-gray-500" />
            Dosya Ekle
          </button>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-brand-green-500 text-white font-medium rounded-md hover:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
        >
          Operasyonu Başlat
        </button>
      </div>
    </form>
  );
} 