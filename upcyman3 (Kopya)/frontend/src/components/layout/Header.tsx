'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/Modal';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Yeni bir bakım görevi atandı', time: '5 dk önce', read: false },
    { id: 2, message: 'Stok seviyesi kritik eşiğin altında', time: '1 saat önce', read: false },
    { id: 3, message: 'Vardiya değişimi yaklaşıyor', time: '2 saat önce', read: true },
  ]);

  // Form state'leri
  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    department: '',
    position: '',
    startDate: '',
  });

  // Form değişiklik handler'ı
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form gönderim handler'ı
  const handleProfileSubmit = () => {
    // TODO: Profil güncelleme API çağrısı yapılacak
    console.log('Profil güncelleniyor:', formData);
    setShowProfileModal(false);
  };

  // Sayfa adını belirleyen fonksiyon
  const getPageTitle = () => {
    const path = pathname?.split('/').pop() || '';
    switch (path) {
      case 'dashboard':
        return 'Ana Sayfa';
      case 'waste-entry':
        return 'Atık Kabul';
      case 'operations':
        return 'Operasyon';
      case 'sales':
        return 'Satış';
      case 'inventory':
        return 'Stok Yönetimi';
      case 'finance':
        return 'Maliyet ve Finans';
      case 'maintenance':
        return 'Bakım ve Onarım';
      case 'personnel':
        return 'Personel';
      case 'reports':
        return 'Raporlama';
      default:
        return '';
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-1">
            {/* Mobil Logo */}
            <div className="flex items-center md:hidden">
              <Link href="/dashboard" className="text-brand-green-500 text-2xl font-bold hover:text-brand-green-600 transition-colors">
                UpcyMan
              </Link>
            </div>
            {/* Masaüstü Logo */}
            <div className="hidden md:flex md:items-center">
              <Link 
                href="/dashboard" 
                className="text-brand-green-500 text-2xl font-bold hover:text-brand-green-600 transition-colors flex items-center space-x-2"
              >
                <span className="bg-gradient-to-r from-brand-green-500 to-brand-green-600 text-white px-3 py-1 rounded-lg">
                  Upcy
                </span>
                <span>Man</span>
              </Link>
            </div>
          </div>

          {/* Sayfa Başlığı */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>

          {/* Sağ taraf */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {/* Bildirimler */}
            <Menu as="div" className="relative">
              <Menu.Button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500">
                <span className="sr-only">Bildirimleri göster</span>
                <BellIcon className="h-6 w-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
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
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Bildirimler</h3>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-sm text-brand-green-500 hover:text-brand-green-600"
                      >
                        Tümünü okundu işaretle
                      </button>
                    </div>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start ${!notification.read ? 'bg-gray-50' : ''} p-2 rounded-lg`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                            <p className="text-sm text-gray-500">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="ml-3 flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-brand-green-500"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Kullanıcı menüsü */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500">
                <span className="sr-only">Kullanıcı menüsünü aç</span>
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-brand-green-400 to-brand-green-600 text-white flex items-center justify-center text-lg font-semibold shadow-lg transition-transform hover:scale-105">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
                </div>
                <div className="hidden md:flex md:flex-col md:items-start">
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
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
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-700">Giriş yapan kullanıcı</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setShowProfileModal(true)}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                          Profil
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setShowSettingsModal(true)}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                          Ayarlar
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-red-700`}
                        >
                          Çıkış Yap
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Profil Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Profil Bilgileri"
      >
        <div className="p-6">
          {/* Profil Başlığı */}
          <div className="flex items-start space-x-6 pb-6 border-b border-gray-200">
            <div className="relative">
              <div className="h-24 w-24 rounded-xl bg-gradient-to-r from-brand-green-400 to-brand-green-600 text-white flex items-center justify-center text-4xl font-semibold shadow-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border-2 border-brand-green-500 text-brand-green-500 hover:text-brand-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{user?.username}</h3>
              <p className="text-gray-500">{user?.email}</p>
              <div className="mt-4 flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-green-100 text-brand-green-800">
                  Aktif
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role || 'Kullanıcı'}
                </span>
              </div>
            </div>
          </div>

          {/* Profil Detayları */}
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-4">Kişisel Bilgiler</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                      placeholder="Ad Soyad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">E-posta</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                      placeholder="E-posta"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                      placeholder="Telefon"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-4">İş Bilgileri</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Departman</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                      placeholder="Departman"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                      placeholder="Pozisyon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green-500 focus:ring-brand-green-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Güvenlik</h4>
              <div className="space-y-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500">
                  Şifre Değiştir
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500">
                  İki Faktörlü Doğrulama
                </button>
              </div>
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowProfileModal(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
            >
              İptal
            </button>
            <button
              onClick={handleProfileSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green-600 hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
            >
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </Modal>

      {/* Ayarlar Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Sistem Ayarları"
      >
        <div className="p-6 space-y-8">
          {/* Genel Ayarlar */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Genel Ayarlar</h3>
            <div className="space-y-6">
              {/* Bildirim Ayarları */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Bildirimler</h4>
                  <p className="text-sm text-gray-500">E-posta ve sistem bildirimleri</p>
                </div>
                <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500 bg-brand-green-500">
                  <span className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                </button>
              </div>

              {/* Tema Ayarları */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Karanlık Mod</h4>
                  <p className="text-sm text-gray-500">Arayüz teması</p>
                </div>
                <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500 bg-gray-200">
                  <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                </button>
              </div>

              {/* Dil Ayarları */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Dil</h4>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-green-500 focus:border-brand-green-500 sm:text-sm rounded-md">
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Saat Dilimi */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Saat Dilimi</h4>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-green-500 focus:border-brand-green-500 sm:text-sm rounded-md">
                  <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                  <option value="Europe/London">London (UTC+0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Güvenlik Ayarları */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Güvenlik</h3>
            <div className="space-y-6">
              {/* Oturum Güvenliği */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Oturum Kilidi</h4>
                  <p className="text-sm text-gray-500">30 dakika hareketsizlik sonrası</p>
                </div>
                <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500 bg-brand-green-500">
                  <span className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                </button>
              </div>

              {/* İki Faktörlü Doğrulama */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">İki Faktörlü Doğrulama</h4>
                  <p className="text-sm text-gray-500">SMS veya Authenticator ile doğrulama</p>
                </div>
                <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500 bg-gray-200">
                  <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                </button>
              </div>

              {/* Güvenlik Geçmişi */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Son Oturumlar</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-900">Windows 10 - Chrome</span>
                    </div>
                    <span className="text-gray-500">Şimdi</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-900">iPhone 12 - Safari</span>
                    </div>
                    <span className="text-gray-500">2 saat önce</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bildirim Ayarları */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirim Tercihleri</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-brand-green-500 focus:ring-brand-green-500 border-gray-300 rounded"
                />
                <label htmlFor="email-notifications" className="ml-3">
                  <span className="text-sm font-medium text-gray-900">E-posta Bildirimleri</span>
                  <p className="text-sm text-gray-500">Önemli sistem güncellemeleri ve duyurular</p>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="sms-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-brand-green-500 focus:ring-brand-green-500 border-gray-300 rounded"
                />
                <label htmlFor="sms-notifications" className="ml-3">
                  <span className="text-sm font-medium text-gray-900">SMS Bildirimleri</span>
                  <p className="text-sm text-gray-500">Kritik uyarılar ve güvenlik bildirimleri</p>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="browser-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-brand-green-500 focus:ring-brand-green-500 border-gray-300 rounded"
                />
                <label htmlFor="browser-notifications" className="ml-3">
                  <span className="text-sm font-medium text-gray-900">Tarayıcı Bildirimleri</span>
                  <p className="text-sm text-gray-500">Anlık masaüstü bildirimleri</p>
                </label>
              </div>
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
            >
              İptal
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green-600 hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
            >
              Ayarları Kaydet
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
} 