'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
  icon: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Fiyat değişikliklerini ve uyarıları Slack kanalınızda alın',
    isConnected: false,
    icon: '🔔'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Telegram botumuz üzerinden anlık bildirimler alın',
    isConnected: false,
    icon: '📱'
  },
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'Kendi sistemlerinize webhook ile entegre edin',
    isConnected: false,
    icon: '🔗'
  }
];

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);

  const handleIntegrationToggle = async (id: string) => {
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === id
            ? { ...integration, isConnected: !integration.isConnected }
            : integration
        )
      );

      const integration = integrations.find(i => i.id === id);
      if (integration) {
        toast.success(
          `${integration.name} ${integration.isConnected ? 'bağlantısı kesildi' : 'bağlandı'}`
        );
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Entegrasyonlar</h3>
        <p className="text-sm text-gray-500 mb-6">
          Diğer servislerle entegre olarak bildirimlerinizi yönetin
        </p>

        <div className="space-y-4">
          {integrations.map(integration => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleIntegrationToggle(integration.id)}
                className={`${
                  integration.isConnected
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-200 hover:bg-gray-300'
                } relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                {integration.isConnected ? 'Bağlantıyı Kes' : 'Bağlan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Erişimi</h3>
        <p className="text-sm text-gray-500 mb-4">
          API anahtarınızı kullanarak kendi uygulamalarınızı entegre edin
        </p>
        <div className="bg-gray-50 p-4 rounded-md">
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {`curl -X GET "https://api.upcytakip.com/v1/prices" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
          </pre>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => toast.success('API anahtarı kopyalandı')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            API Anahtarını Kopyala
          </button>
        </div>
      </div>
    </div>
  );
} 