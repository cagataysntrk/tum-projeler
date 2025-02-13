'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  ArrowDownTrayIcon,
  CogIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CalculatorIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Ana Sayfa', href: '/dashboard', icon: HomeIcon },
  { name: 'Atık Kabul', href: '/dashboard/waste-entry', icon: ArrowDownTrayIcon },
  { name: 'Operasyon', href: '/dashboard/operations', icon: CogIcon },
  { name: 'Satış', href: '/dashboard/sales', icon: ShoppingCartIcon },
  { name: 'Stok Yönetimi', href: '/dashboard/inventory', icon: ClipboardDocumentListIcon },
  { name: 'Maliyet ve Finans', href: '/dashboard/finance', icon: CalculatorIcon },
  { name: 'Bakım ve Onarım', href: '/dashboard/maintenance', icon: WrenchScrewdriverIcon },
  { name: 'Personel', href: '/dashboard/personnel', icon: UserGroupIcon },
  { name: 'Raporlama', href: '/dashboard/reports', icon: ChartBarIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-neutral-850">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-brand-green-500 text-white'
                      : 'text-gray-300 hover:bg-brand-green-500/10 hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-3 flex-shrink-0 h-6 w-6
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white'
                      }
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 