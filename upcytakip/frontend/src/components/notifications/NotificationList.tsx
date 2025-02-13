'use client';

import { useState } from 'react';
import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Notification } from '@/types/notification';

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'price_alert',
    title: 'Fiyat Uyarısı',
    message: 'İstanbul bölgesinde hurda kağıt fiyatı 2000 TL üzerine çıktı!',
    priority: 'high',
    status: 'unread',
    createdAt: new Date('2024-02-20T10:00:00'),
  },
  {
    id: '2',
    userId: '1',
    type: 'daily_report',
    title: 'Günlük Rapor',
    message: 'Günlük fiyat raporu hazır. İncelemek için tıklayın.',
    priority: 'medium',
    status: 'read',
    createdAt: new Date('2024-02-19T10:00:00'),
    readAt: new Date('2024-02-19T10:30:00'),
  },
];

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, status: 'read' as const, readAt: new Date() }
          : notification
      )
    );
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Son Bildirimler</h2>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Tümünü Okundu İşaretle
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.status === 'unread'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <BellIcon
                  className={`h-6 w-6 ${
                    notification.status === 'unread'
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      notification.priority
                    )}`}
                  >
                    {notification.priority === 'high'
                      ? 'Yüksek'
                      : notification.priority === 'medium'
                      ? 'Orta'
                      : 'Düşük'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {notification.createdAt.toLocaleString('tr-TR')}
                  </p>
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Okundu İşaretle
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 