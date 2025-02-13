'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { NotificationRule } from '@/types/notification';

const mockRules: NotificationRule[] = [
  {
    id: '1',
    userId: '1',
    paperType: 'Hurda Kağıt',
    region: 'İstanbul',
    condition: 'above',
    value: 2000,
    channels: ['email', 'in_app'],
    frequency: 'instant',
    isActive: true,
    createdAt: new Date('2024-02-20T10:00:00'),
  },
];

export default function NotificationRules() {
  const [rules, setRules] = useState<NotificationRule[]>(mockRules);

  const toggleRule = (ruleId: string) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Alarm Kuralları</h2>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Yeni Kural Ekle
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {rule.paperType} - {rule.region}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {rule.condition === 'above'
                    ? `${rule.value} TL üzerine çıktığında`
                    : rule.condition === 'below'
                    ? `${rule.value} TL altına düştüğünde`
                    : `%${rule.value} değişim olduğunda`}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  {rule.channels.map((channel) => (
                    <span
                      key={channel}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {channel === 'email'
                        ? 'E-posta'
                        : channel === 'sms'
                        ? 'SMS'
                        : channel === 'push'
                        ? 'Push'
                        : 'Uygulama İçi'}
                    </span>
                  ))}
                </div>
              </div>
              <Switch
                checked={rule.isActive}
                onChange={() => toggleRule(rule.id)}
                className={`${
                  rule.isActive ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    rule.isActive ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                >
                  <span
                    className={`${
                      rule.isActive
                        ? 'opacity-0 duration-100 ease-out'
                        : 'opacity-100 duration-200 ease-in'
                    } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={`${
                      rule.isActive
                        ? 'opacity-100 duration-200 ease-in'
                        : 'opacity-0 duration-100 ease-out'
                    } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </Switch>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 