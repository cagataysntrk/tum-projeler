const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const User = require('../models/User');

// Sistem istatistiklerini getir
router.get('/stats', async (req, res) => {
  try {
    // Mock istatistik verileri
    const stats = {
      activeUsers: 156,
      totalUsers: 250,
      dailyActiveUsers: 89,
      totalPriceEntries: 1250,
      dailyPriceEntries: 45,
      apiRequests: 2800,
      cpuUsage: 35,
      memoryUsage: 42,
      diskUsage: 28,
      uptime: 156000
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'İstatistikler yüklenirken bir hata oluştu' });
  }
});

// Kullanıcı aktivite verilerini getir
router.get('/stats/user-activity', async (req, res) => {
  try {
    const data = {
      labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
      datasets: [
        {
          label: 'Aktif Kullanıcılar',
          data: [65, 72, 68, 75, 80, 45, 50],
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.4
        }
      ]
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı aktivite verileri yüklenirken bir hata oluştu' });
  }
});

// Sistem kaynak kullanım verilerini getir
router.get('/stats/resource-usage', async (req, res) => {
  try {
    const data = {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [
        {
          label: 'CPU Kullanımı (%)',
          data: [35, 38, 42, 45, 40, 35],
          backgroundColor: 'rgba(59, 130, 246, 0.5)'
        },
        {
          label: 'Bellek Kullanımı (%)',
          data: [42, 45, 48, 50, 45, 42],
          backgroundColor: 'rgba(16, 185, 129, 0.5)'
        },
        {
          label: 'Disk Kullanımı (%)',
          data: [28, 28, 30, 32, 30, 28],
          backgroundColor: 'rgba(245, 158, 11, 0.5)'
        }
      ]
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Sistem kaynak kullanım verileri yüklenirken bir hata oluştu' });
  }
});

// Kullanıcı listesini getir
router.get('/users', async (req, res) => {
  try {
    const users = [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        role: 'user',
        isActive: true,
        lastLogin: '2024-02-20T10:30:00Z'
      },
      {
        id: '2',
        name: 'Mehmet Demir',
        email: 'mehmet@example.com',
        role: 'admin',
        isActive: true,
        lastLogin: '2024-02-20T09:15:00Z'
      }
    ];

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı listesi yüklenirken bir hata oluştu' });
  }
});

// Fiyat verilerini getir
router.get('/prices', async (req, res) => {
  try {
    const prices = [
      {
        id: '1',
        paperType: 'Karton',
        region: 'İstanbul',
        price: 3.25,
        date: '2024-02-20',
        change: '+0.15'
      },
      {
        id: '2',
        paperType: 'Gazete',
        region: 'Ankara',
        price: 2.75,
        date: '2024-02-20',
        change: '-0.05'
      }
    ];

    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: 'Fiyat verileri yüklenirken bir hata oluştu' });
  }
});

// Kullanıcı detaylarını getir
router.get('/users/:id', async (req, res) => {
  try {
    const mockUser = {
      id: req.params.id,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      role: 'user',
      isActive: true,
      company: 'ABC Ltd.',
      phone: '+90 555 123 4567',
      subscriptionType: 'pro',
      subscriptionEndDate: '2024-12-31',
      lastLogin: '2024-02-20T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      loginHistory: [
        { date: '2024-02-20T10:30:00Z', ip: '192.168.1.1' },
        { date: '2024-02-19T15:45:00Z', ip: '192.168.1.1' }
      ]
    };

    res.json(mockUser);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı detayları yüklenirken bir hata oluştu' });
  }
});

// Kullanıcı güncelle
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = {
      id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı güncellenirken bir hata oluştu' });
  }
});

// Kullanıcı sil
router.delete('/users/:id', async (req, res) => {
  try {
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı silinirken bir hata oluştu' });
  }
});

// Veri yönetimi - Fiyat girişleri listesi
router.get('/data/entries', async (req, res) => {
  try {
    const entries = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Ahmet Yılmaz',
        paperType: 'Karton',
        region: 'İstanbul',
        minPrice: 3.15,
        maxPrice: 3.35,
        averagePrice: 3.25,
        source: 'Saha Araştırması',
        status: 'approved',
        createdAt: '2024-02-20T10:00:00Z',
        updatedAt: '2024-02-20T10:30:00Z'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Mehmet Demir',
        paperType: 'Gazete',
        region: 'Ankara',
        minPrice: 2.65,
        maxPrice: 2.85,
        averagePrice: 2.75,
        source: 'Telefon Görüşmesi',
        status: 'pending',
        createdAt: '2024-02-20T09:00:00Z',
        updatedAt: '2024-02-20T09:00:00Z'
      }
    ];

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Veri girişleri yüklenirken bir hata oluştu' });
  }
});

// Veri yönetimi - Fiyat girişi detayı
router.get('/data/entries/:id', async (req, res) => {
  try {
    const entry = {
      id: req.params.id,
      userId: 'user1',
      userName: 'Ahmet Yılmaz',
      paperType: 'Karton',
      region: 'İstanbul',
      minPrice: 3.15,
      maxPrice: 3.35,
      averagePrice: 3.25,
      source: 'Saha Araştırması',
      notes: 'Fiyatlar KDV dahil değildir',
      status: 'approved',
      approvedBy: 'admin1',
      approvedAt: '2024-02-20T10:30:00Z',
      createdAt: '2024-02-20T10:00:00Z',
      updatedAt: '2024-02-20T10:30:00Z',
      history: [
        {
          action: 'created',
          date: '2024-02-20T10:00:00Z',
          user: 'Ahmet Yılmaz'
        },
        {
          action: 'approved',
          date: '2024-02-20T10:30:00Z',
          user: 'Admin'
        }
      ]
    };

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Veri girişi detayları yüklenirken bir hata oluştu' });
  }
});

// Veri yönetimi - Fiyat girişi güncelle
router.put('/data/entries/:id', async (req, res) => {
  try {
    const updatedEntry = {
      id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: 'Veri girişi güncellenirken bir hata oluştu' });
  }
});

// Veri yönetimi - Fiyat girişi sil
router.delete('/data/entries/:id', async (req, res) => {
  try {
    res.json({ message: 'Veri girişi başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Veri girişi silinirken bir hata oluştu' });
  }
});

// Veri yönetimi - Toplu onaylama/reddetme
router.post('/data/entries/bulk-action', async (req, res) => {
  try {
    const { action, entryIds } = req.body;
    res.json({
      message: `${entryIds.length} adet veri girişi ${action === 'approve' ? 'onaylandı' : 'reddedildi'}`,
      updatedEntries: entryIds.map(id => ({
        id,
        status: action === 'approve' ? 'approved' : 'rejected',
        updatedAt: new Date().toISOString()
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Toplu işlem yapılırken bir hata oluştu' });
  }
});

// Veri yönetimi - İstatistikler
router.get('/data/stats', async (req, res) => {
  try {
    const stats = {
      totalEntries: 1250,
      pendingEntries: 45,
      approvedEntries: 1150,
      rejectedEntries: 55,
      todayEntries: 25,
      weeklyEntries: 180,
      monthlyEntries: 750,
      topContributors: [
        { userId: 'user1', name: 'Ahmet Yılmaz', entries: 125 },
        { userId: 'user2', name: 'Mehmet Demir', entries: 98 }
      ],
      regionStats: {
        'İstanbul': 450,
        'Ankara': 320,
        'İzmir': 280,
        'Bursa': 200
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Veri istatistikleri yüklenirken bir hata oluştu' });
  }
});

module.exports = router; 