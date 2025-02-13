const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Yetkilendirme hatası' });
    }

    const hasRole = allowedRoles.includes(req.user.role);
    
    if (!hasRole && req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        error: 'Bu işlem için yetkiniz bulunmuyor' 
      });
    }

    next();
  };
};

// Rol hiyerarşisi ve izinler
const ROLE_HIERARCHY = {
  veri_girisci: ['veri_girisci'],
  veri_goruntuleyen: ['veri_goruntuleyen'],
  veri_admin: ['veri_girisci', 'veri_goruntuleyen', 'veri_admin'],
  sistem_admin: ['veri_goruntuleyen', 'sistem_admin'],
  superadmin: ['veri_girisci', 'veri_goruntuleyen', 'veri_admin', 'sistem_admin', 'superadmin']
};

// Abonelik tipine göre izinler
const SUBSCRIPTION_PERMISSIONS = {
  standart: {
    dataAccess: 'daily',
    features: ['basic_reports']
  },
  pro: {
    dataAccess: 'realtime',
    features: ['basic_reports', 'advanced_reports', 'notifications']
  },
  kurumsal: {
    dataAccess: 'realtime',
    features: ['basic_reports', 'advanced_reports', 'notifications', 'api_access', 'custom_reports']
  }
};

module.exports = {
  roleCheck,
  ROLE_HIERARCHY,
  SUBSCRIPTION_PERMISSIONS
}; 