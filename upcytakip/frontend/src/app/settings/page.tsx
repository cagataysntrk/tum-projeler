'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AccountSettings from '@/components/settings/AccountSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', name: 'Hesap' },
    { id: 'security', name: 'Güvenlik' },
    { id: 'integrations', name: 'Entegrasyonlar' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'integrations':
        return <IntegrationSettings />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Sekmeler */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* İçerik */}
          <div>{renderContent()}</div>
        </div>
      </div>
    </MainLayout>
  );
} 