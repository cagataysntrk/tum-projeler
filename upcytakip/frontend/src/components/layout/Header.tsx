'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  onMenuClick: () => void;
}

interface MenuItemProps {
  active: boolean;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [unreadNotifications] = useState(2); // Mock unread notifications count

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Menüyü aç</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-4 lg:ml-0">
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  UPC Takip
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/notifications"
              className="relative rounded-full bg-white p-2 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="sr-only">Bildirimleri görüntüle</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white ring-2 ring-white">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="sr-only">Kullanıcı menüsünü aç</span>
                <Image
                  src="/avatar.png"
                  alt="User"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }: MenuItemProps) => (
                      <Link
                        href="/profile"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Profil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: MenuItemProps) => (
                      <Link
                        href="/notifications"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Bildirimler
                        {unreadNotifications > 0 && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: MenuItemProps) => (
                      <Link
                        href="/settings"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Ayarlar
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: MenuItemProps) => (
                      <button
                        type="button"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                      >
                        Çıkış Yap
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
} 