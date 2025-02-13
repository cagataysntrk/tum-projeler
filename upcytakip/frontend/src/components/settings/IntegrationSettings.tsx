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
    description: 'Fiyat değişikliklerini Slack kanalınıza gönderin',
    isConnected: false,
    icon: '🔔'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Telegram botunuz üzerinden güncellemeleri alın',
    isConnected: false,
    icon: '📱'
  },
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'Özel webhook URL\'inize bildirimler gönderin',
    isConnected: false,
    icon: '🔗'
  }
];

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [apiKey] = useState('sk_test_123456789');

  const handleIntegrationToggle = async (id: string) => {
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prevIntegrations =>
        prevIntegrations.map(integration =>
          integration.id === id
            ? { ...integration, isConnected: !integration.isConnected }
            : integration
        )
      );

      const integration = integrations.find(i => i.id === id);
      if (integration) {
        toast.success(`${integration.name} ${integration.isConnected ? 'bağlantısı kesildi' : 'bağlandı'}`);
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API anahtarı panoya kopyalandı');
  };

  return (
    <div className="space-y-8 p-6">
      {/* Entegrasyonlar */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Entegrasyonlar</h3>
        <div className="space-y-4">
          {integrations.map(integration => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleIntegrationToggle(integration.id)}
                className={`${
                  integration.isConnected
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-primary-600 hover:bg-primary-700'
                } px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                {integration.isConnected ? 'Bağlantıyı Kes' : 'Bağlan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Erişimi */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Erişimi</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            API'yi kullanmak için aşağıdaki komutu kullanın:
          </p>
          <div className="bg-gray-800 text-gray-200 p-4 rounded-md font-mono text-sm mb-4">
            curl -X GET "https://api.upcytakip.com/v1/prices" \
            <br />
            &nbsp;&nbsp;-H "Authorization: Bearer {apiKey}"
          </div>
          <button
            onClick={handleCopyApiKey}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            API Anahtarını Kopyala
          </button>
        </div>
      </div>
    </div>
  );
} 