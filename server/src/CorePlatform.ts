import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import performanceRoutes from './routes/performance.routes';
import charityRegistryRoutes from './routes/charityRegistry.routes';
import impactDrawRoutes from './routes/impactDraw.routes';
import bookingRoutes from './routes/booking.routes';

dotenv.config();
const app = express();

// 1. MIDDLEWARE
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); // <--- CRITICAL: MUST BE ABOVE ROUTES

// 2. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/registry', charityRegistryRoutes);
app.use('/api/impact-draws', impactDrawRoutes);
app.use('/api/bookings', bookingRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Core Platform Online: Port ${PORT}`));