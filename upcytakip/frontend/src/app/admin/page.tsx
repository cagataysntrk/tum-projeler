'use client';

import { useState } from 'react';
import UserManagement from '@/components/admin/UserManagement';
import DataManagement from '@/components/admin/DataManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import Statistics from '@/components/admin/Statistics';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('statistics');

  const tabs = [
    { id: 'statistics', name: 'İstatistikler' },
    { id: 'users', name: 'Kullanıcı Yönetimi' },
    { id: 'data', name: 'Veri Yönetimi' },
    { id: 'settings', name: 'Sistem Ayarları' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <Statistics />;
      case 'users':
        return <UserManagement />;
      case 'data':
        return <DataManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Statistics />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Yönetici Paneli</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mt-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 