'use client';

import { useState } from 'react';
import { 
  PaperAirplaneIcon, 
  BeakerIcon, 
  CubeIcon,
  ScaleIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface MaterialType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const materialTypes: MaterialType[] = [
  {
    id: 'paper',
    name: 'Kağıt',
    icon: <PaperAirplaneIcon className="h-8 w-8" />,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  },
  {
    id: 'plastic',
    name: 'Plastik',
    icon: <BeakerIcon className="h-8 w-8" />,
    color: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  {
    id: 'metal',
    name: 'Metal',
    icon: <CubeIcon className="h-8 w-8" />,
    color: 'bg-gray-100 text-gray-700 border-gray-300'
  },
  {
    id: 'glass',
    name: 'Cam',
    icon: <BeakerIcon className="h-8 w-8" />,
    color: 'bg-green-100 text-green-700 border-green-300'
  }
];

const qualityLevels = [
  { id: 'A', name: 'A Sınıfı - Premium', description: 'En yüksek kalite, minimum kirlilik' },
  { id: 'B', name: 'B Sınıfı - Standart', description: 'Normal kalite, kabul edilebilir kirlilik' },
  { id: 'C', name: 'C Sınıfı - Düşük', description: 'Düşük kalite, yüksek kirlilik' }
];

interface WasteEntryFormProps {
  onSubmit: (data: any) => void;
}

export default function WasteEntryForm({ onSubmit }: WasteEntryFormProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [qualityLevel, setQualityLevel] = useState<string>('');
  const [isScaleConnected, setIsScaleConnected] = useState(false);
  
  // Fire girişi için state'ler
  const [hasWaste, setHasWaste] = useState(false);
  const [wasteAmount, setWasteAmount] = useState<string>('');
  const [wasteReason, setWasteReason] = useState<string>('');
  const [wasteDescription, setWasteDescription] = useState<string>('');

  const handleScaleConnection = () => {
    // Gerçek uygulamada burada tartı cihazı bağlantısı yapılacak
    setIsScaleConnected(true);
    // Örnek veri
    setWeight('1250');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      materialType: selectedMaterial,
      weight: parseFloat(weight),
      unitPrice: parseFloat(unitPrice),
      qualityLevel,
      timestamp: new Date().toISOString(),
      waste: hasWaste ? {
        amount: parseFloat(wasteAmount),
        reason: wasteReason,
        description: wasteDescription
      } : null
    };

    onSubmit(formData);
  };

  const calculateTotal = () => {
    if (weight && unitPrice) {
      return (parseFloat(weight) * parseFloat(unitPrice)).toFixed(2);
    }
    return '0.00';
  };

  // Fire oranı hesaplama
  const calculateWastePercentage = () => {
    if (weight && wasteAmount) {
      const totalWeight = parseFloat(weight);
      const waste = parseFloat(wasteAmount);
      return ((waste / totalWeight) * 100).toFixed(1);
    }
    return '0.0';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Malzeme Türü Seçimi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Malzeme Türü
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {materialTypes.map((material) => (
            <button
              key={material.id}
              type="button"
              onClick={() => setSelectedMaterial(material.id)}
              className={`${
                selectedMaterial === material.id
                  ? `${material.color} border-2`
                  : 'bg-white border hover:bg-gray-50'
              } p-4 rounded-lg border flex flex-col items-center justify-center transition-colors`}
            >
              {material.icon}
              <span className="mt-2 text-sm font-medium">{material.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Miktar ve Fiyat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Miktar (kg)
          </label>
          <div className="flex">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 rounded-l-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
              placeholder="0.00"
            />
            <button
              type="button"
              onClick={handleScaleConnection}
              className={`px-4 py-2 rounded-r-md border border-l-0 ${
                isScaleConnected
                  ? 'bg-brand-green-100 text-brand-green-700 border-brand-green-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              <ScaleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birim Fiyat (₺/kg)
          </label>
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Toplam Tutar */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Toplam Tutar:</span>
          <span className="text-2xl font-bold text-gray-900">
            ₺{calculateTotal()}
          </span>
        </div>
      </div>

      {/* Kalite Kontrolü */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Kalite Sınıfı
        </label>
        <div className="space-y-2">
          {qualityLevels.map((level) => (
            <label
              key={level.id}
              className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                qualityLevel === level.id
                  ? 'bg-brand-green-50 border-brand-green-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="quality"
                value={level.id}
                checked={qualityLevel === level.id}
                onChange={(e) => setQualityLevel(e.target.value)}
                className="mt-1 text-brand-green-500 focus:ring-brand-green-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">
                  {level.name}
                </span>
                <span className="block text-sm text-gray-500">
                  {level.description}
                </span>
              </div>
              {qualityLevel === level.id && (
                <CheckCircleIcon className="ml-auto h-5 w-5 text-brand-green-500" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Fire Girişi */}
      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">
            Fire Girişi
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={hasWaste}
              onChange={(e) => setHasWaste(e.target.checked)}
              className="h-4 w-4 text-brand-green-500 focus:ring-brand-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-500">Fire var mı?</span>
          </div>
        </div>

        {hasWaste && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fire Miktarı (kg)
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={wasteAmount}
                    onChange={(e) => setWasteAmount(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
                    placeholder="0.00"
                  />
                  <div className="ml-2 px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700">
                    {calculateWastePercentage()}%
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fire Nedeni
                </label>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value)}
                  className="w-full rounded-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
                >
                  <option value="">Seçiniz...</option>
                  <option value="contamination">Kirlilik/Kontaminasyon</option>
                  <option value="damage">Hasar/Yıpranma</option>
                  <option value="moisture">Nem/Rutubet</option>
                  <option value="processing">İşleme Kaybı</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={wasteDescription}
                onChange={(e) => setWasteDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border-gray-300 focus:border-brand-green-500 focus:ring-brand-green-500"
                placeholder="Fire hakkında detaylı açıklama..."
              />
            </div>

            {parseFloat(calculateWastePercentage()) > 10 && (
              <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                <p className="ml-3 text-sm text-yellow-700">
                  Fire oranı %10'un üzerinde. Lütfen kontrol ediniz ve gerekli önlemleri alınız.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kaydet Butonu */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-brand-green-500 text-white font-medium rounded-md hover:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
        >
          Atık Kabulünü Tamamla
        </button>
      </div>
    </form>
  );
} 