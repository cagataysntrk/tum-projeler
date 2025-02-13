import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import maintenanceRoutes from './routes/maintenanceRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/maintenance', maintenanceRoutes);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/upcyman')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Server başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 