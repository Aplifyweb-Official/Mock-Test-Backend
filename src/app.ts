import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { authRoutes } from './modules/auth/auth.routes.js';

const app: Application = express();

// ── 1. Global Middlewares ──
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// ── 2. Health Check API ──
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'ExamAI Server is alive and kicking! 🚀' });
});

// 👇 ========================================================== 👇
// 🔥 SAHI JAGAH: AUTH ROUTES YAHAN (404 SE UPAR) HONE CHAHIYE 🔥
console.log("--> Mounting Auth Routes! <--");
app.use('/api/v1/auth', authRoutes);
// 👆 ========================================================== 👆


// ── 3. 404 Route Handler (YE HAMESHA ROUTES KE NEECHE HONA CHAHIYE) ──
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: `Bhaiya naya 404 aa gaya: ${req.originalUrl}` // <-- Ye line add kar
    });
});

// ── 4. Global Error Handler (YE SABSE AAKHRI MEIN HONA CHAHIYE) ──
app.use(globalErrorHandler);

export default app;