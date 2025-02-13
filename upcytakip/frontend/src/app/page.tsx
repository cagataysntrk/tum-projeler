'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Token kontrolü
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Kullanıcı bilgilerini kontrol et
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token geçersiz');
        }

        const data = await response.json();
        router.push(data.defaultRoute || '/dashboard');
      } catch (error) {
        console.error('Auth hatası:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  // Yönlendirme yapılırken loading göster
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
    </div>
  );
}
