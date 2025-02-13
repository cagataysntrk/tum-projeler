const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const User = require('../models/User');

// Sistem istatistiklerini getir
router.get('/stats', auth, roleCheck('sistem_admin', 'superadmin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const dailyActiveUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Mock veriler (gerçek sistemde bu veriler farklı kaynaklardan gelecek)
    const stats = {
      activeUsers,
      totalUsers,
      dailyActiveUsers,
      totalPriceEntries: 1250,
      dailyPriceEntries: 45,
      apiRequests: 2800,
      cpuUsage: 35,
      memoryUsage: 42,
      diskUsage: 28,
      uptime: process.uptime()
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'İstatistikler yüklenirken bir hata oluştu' });
  }
});

// Kullanıcı aktivite verilerini getir
router.get('/stats/user-activity', auth, roleCheck('sistem_admin', 'superadmin'), async (req, res) => {
  try {
    // Mock veri (gerçek sistemde veritabanından gelecek)
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
    console.error('User activity error:', error);
    res.status(500).json({ error: 'Kullanıcı aktivite verileri yüklenirken bir hata oluştu' });
  }
});

// Sistem kaynak kullanım verilerini getir
router.get('/stats/resource-usage', auth, roleCheck('sistem_admin', 'superadmin'), async (req, res) => {
  try {
    // Mock veri (gerçek sistemde sistem metriklerinden gelecek)
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
    console.error('Resource usage error:', error);
    res.status(500).json({ error: 'Sistem kaynak kullanım verileri yüklenirken bir hata oluştu' });
  }
});

// Veri girişlerini listele
router.get('/data/entries', auth, roleCheck('sistem_admin', 'superadmin'), async (req, res) => {
  try {
    // Mock veri
    const mockEntries = [
      {
        id: '1',
        userId: '1',
        userName: 'Ahmet Yılmaz',
        paperType: 'Karton',
        region: 'İstanbul',
        price: 3500,
        date: new Date().toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: '2',
        userName: 'Mehmet Demir',
        paperType: 'Gazete',
        region: 'Ankara',
        price: 2800,
        date: new Date().toISOString(),
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        userId: '3',
        userName: 'Ayşe Kaya',
        paperType: 'Beyaz Kağıt',
        region: 'İzmir',
        price: 4200,
        date: new Date().toISOString(),
        status: 'rejected',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Filtreleme işlemleri
    let filteredEntries = [...mockEntries];
    const { status, region, paperType, startDate, endDate } = req.query;

    if (status) {
      filteredEntries = filteredEntries.filter(entry => entry.status === status);
    }
    if (region) {
      filteredEntries = filteredEntries.filter(entry => entry.region === region);
    }
    if (paperType) {
      filteredEntries = filteredEntries.filter(entry => entry.paperType === paperType);
    }
    if (startDate) {
      filteredEntries = filteredEntries.filter(entry => new Date(entry.date) >= new Date(startDate));
    }
    if (endDate) {
      filteredEntries = filteredEntries.filter(entry => new Date(entry.date) <= new Date(endDate));
    }

    res.json({ entries: filteredEntries });
  } catch (error) {
    console.error('Data entries error:', error);
    res.status(500).json({ error: 'Veri girişleri yüklenirken bir hata oluştu' });
  }
});

// Veri girişi durumunu güncelle
router.patch('/data/entries/:id', auth, roleCheck('sistem_admin', 'superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum değeri' });
    }

    // Mock güncelleme (gerçek sistemde veritabanında güncellenecek)
    res.json({ 
      message: 'Durum başarıyla güncellendi',
      entry: {
        id,
        status,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Update entry status error:', error);
    res.status(500).json({ error: 'Durum güncellenirken bir hata oluştu' });
  }
});

// Toplu işlem
router.post('/data/entries/bulk-action', auth, roleCheck('sistem_admin', 'superadmin'), async (req, res) => {
  try {
    const { entryIds, action } = req.body;

    if (!Array.isArray(entryIds) || entryIds.length === 0) {
      return res.status(400).json({ error: 'Geçersiz giriş ID listesi' });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Geçersiz işlem' });
    }

    // Mock toplu işlem (gerçek sistemde veritabanında güncellenecek)
    res.json({ 
      message: `${entryIds.length} kayıt başarıyla ${action === 'approve' ? 'onaylandı' : 'reddedildi'}`,
      updatedIds: entryIds
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({ error: 'Toplu işlem yapılırken bir hata oluştu' });
  }
});

module.exports = router; 