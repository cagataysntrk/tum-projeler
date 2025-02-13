'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { NotificationPreferences as INotificationPreferences } from '@/types/notification';

const mockPreferences: INotificationPreferences = {
  userId: '1',
  channels: {
    email: true,
    sms: false,
    push: true,
    in_app: true,
  },
  dailyDigest: true,
  weeklyReport: true,
  priceAlerts: true,
  doNotDisturb: {
    enabled: false,
    startTime: '23:00',
    endTime: '07:00',
  },
};

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<INotificationPreferences>(mockPreferences);

  const updateChannel = (channel: keyof INotificationPreferences['channels']) => {
    setPreferences((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel],
      },
    }));
  };

  const updatePreference = (key: keyof INotificationPreferences) => {
    if (key === 'channels' || key === 'userId') return;
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateDoNotDisturb = (enabled: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      doNotDisturb: {
        ...prev.doNotDisturb,
        enabled,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Bildirim Tercihleri</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bildirim alma tercihlerinizi buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Bildirim Kanalları</h3>
          <div className="space-y-4">
            {Object.entries(preferences.channels).map(([channel, isEnabled]) => (
              <div key={channel} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {channel === 'email'
                    ? 'E-posta'
                    : channel === 'sms'
                    ? 'SMS'
                    : channel === 'push'
                    ? 'Push Bildirim'
                    : 'Uygulama İçi Bildirim'}
                </span>
                <Switch
                  checked={isEnabled}
                  onChange={() => updateChannel(channel as keyof INotificationPreferences['channels'])}
                  className={`${
                    isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Kanal durumunu değiştir</span>
                  <span
                    className={`${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Bildirim Özeti</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Günlük Özet</span>
              <Switch
                checked={preferences.dailyDigest}
                onChange={() => updatePreference('dailyDigest')}
                className={`${
                  preferences.dailyDigest ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Günlük özet durumunu değiştir</span>
                <span
                  className={`${
                    preferences.dailyDigest ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Haftalık Rapor</span>
              <Switch
                checked={preferences.weeklyReport}
                onChange={() => updatePreference('weeklyReport')}
                className={`${
                  preferences.weeklyReport ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Haftalık rapor durumunu değiştir</span>
                <span
                  className={`${
                    preferences.weeklyReport ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Rahatsız Etme Modu</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Aktif</span>
              <Switch
                checked={preferences.doNotDisturb.enabled}
                onChange={updateDoNotDisturb}
                className={`${
                  preferences.doNotDisturb.enabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Rahatsız etme modu durumunu değiştir</span>
                <span
                  className={`${
                    preferences.doNotDisturb.enabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>

            {preferences.doNotDisturb.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Başlangıç Saati
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={preferences.doNotDisturb.startTime}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        doNotDisturb: {
                          ...prev.doNotDisturb,
                          startTime: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    Bitiş Saati
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={preferences.doNotDisturb.endTime}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        doNotDisturb: {
                          ...prev.doNotDisturb,
                          endTime: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
} 