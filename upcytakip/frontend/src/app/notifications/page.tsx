'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NotificationList from '@/components/notifications/NotificationList';
import NotificationRules from '@/components/notifications/NotificationRules';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'rules' | 'preferences'>('list');

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Bildirimler ve Alarmlar
        </h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`${
                activeTab === 'list'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bildirimler
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`${
                activeTab === 'rules'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Alarm Kuralları
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`${
                activeTab === 'preferences'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Tercihler
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'list' && <NotificationList />}
          {activeTab === 'rules' && <NotificationRules />}
          {activeTab === 'preferences' && <NotificationPreferences />}
        </div>
      </div>
    </MainLayout>
  );
} 