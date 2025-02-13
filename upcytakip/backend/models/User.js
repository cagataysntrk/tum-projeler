const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email adresi zorunludur'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  role: {
    type: String,
    enum: ['veri_girisci', 'veri_goruntuleyen', 'veri_admin', 'sistem_admin', 'superadmin'],
    default: 'veri_goruntuleyen'
  },
  subscriptionType: {
    type: String,
    enum: ['standart', 'pro', 'kurumsal'],
    required: true
  },
  subscriptionEndDate: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: [true, 'İsim zorunludur']
  },
  company: String,
  phone: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Abonelik durumu kontrolü
userSchema.methods.isSubscriptionActive = function() {
  return this.subscriptionEndDate > new Date();
};

const User = mongoose.model('User', userSchema);

module.exports = User; 