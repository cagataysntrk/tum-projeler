'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import type { StockItem, StockAdjustment } from '@/app/dashboard/inventory/page';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockItem;
  onSubmit: (adjustment: Omit<StockAdjustment, 'id' | 'createdAt'>) => void;
}

export default function StockAdjustmentModal({
  isOpen,
  onClose,
  stock,
  onSubmit
}: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease'>('increase');
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const adjustment: Omit<StockAdjustment, 'id' | 'createdAt'> = {
      stockId: stock.id,
      adjustmentType,
      amount,
      reason,
      notes,
      approvalStatus: 'pending',
      createdBy: 'current-user' // Gerçek kullanıcı ID'si eklenecek
    };

    onSubmit(adjustment);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stok Düzeltme"
    >
      <div className="space-y-4">
        {/* Stok Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Mevcut Stok</div>
          <div className="text-lg font-medium text-gray-900">
            {stock.materialName} - {stock.currentAmount} {stock.unit}
          </div>
          <div className="text-sm text-gray-500">
            {stock.facility}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Düzeltme Türü */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Düzeltme Türü
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAdjustmentType('increase')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  adjustmentType === 'increase'
                    ? 'bg-brand-green-100 text-brand-green-800 border-brand-green-500'
                    : 'bg-white text-gray-700 border-gray-300'
                } border`}
              >
                Artır (+)
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('decrease')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  adjustmentType === 'decrease'
                    ? 'bg-red-100 text-red-800 border-red-500'
                    : 'bg-white text-gray-700 border-gray-300'
                } border`}
              >
                Azalt (-)
              </button>
            </div>
          </div>

          {/* Miktar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miktar ({stock.unit})
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
              required
            />
          </div>

          {/* Sebep */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Düzeltme Sebebi
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
              required
            >
              <option value="">Seçiniz...</option>
              <option value="fire">Fire / Kayıp</option>
              <option value="damage">Hasar / Bozulma</option>
              <option value="count_error">Sayım Hatası</option>
              <option value="system_error">Sistem Hatası</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border-gray-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
              placeholder="Düzeltme ile ilgili detaylı açıklama..."
            />
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 border border-transparent rounded-md hover:bg-brand-blue-700"
            >
              Düzeltme Talep Et
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 