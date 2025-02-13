'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info';
  timestamp: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function NotificationPanel({ notifications, onDismiss }: NotificationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-700';
      case 'error':
        return 'bg-red-50 border-red-400 text-red-700';
      case 'info':
        return 'bg-blue-50 border-blue-400 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-400 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Bildirimler
            {notifications.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({notifications.length})
              </span>
            )}
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-brand-blue-500 hover:text-brand-blue-700"
          >
            {isExpanded ? 'Daralt' : 'Genişlet'}
          </button>
        </div>
      </div>
      
      <div className={`${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-y-auto transition-all duration-300`}>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Bildirim bulunmuyor
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${getNotificationColor(notification.type)} relative`}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="mt-1 text-sm">{notification.message}</p>
                    <p className="mt-1 text-xs opacity-75">{notification.timestamp}</p>
                  </div>
                  <button
                    onClick={() => onDismiss(notification.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 