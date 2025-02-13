exports.roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Yetkilendirme hatası: Kullanıcı bulunamadı' });
    }

    const hasRole = roles.some(role => req.user.role === role);
    if (!hasRole) {
      return res.status(403).json({ error: 'Yetki hatası: Bu işlem için yetkiniz yok' });
    }

    next();
  };
}; 