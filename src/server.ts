import app from './app.js'; 
import { ENV } from './config/env.config.js';
import { connectDB } from './config/db.config.js';

const startServer = async () => {
    // 1. Pehle Database connect karo
    await connectDB();

    // 2. Fir Server start karo
    const server = app.listen(ENV.PORT, () => {
        console.log(`\n========================================`);
        console.log(`🚀 ExamAI Server is running on port ${ENV.PORT}`);
        console.log(`🌍 Mode: ${ENV.NODE_ENV.toUpperCase()}`);
        console.log(`========================================\n`);
    });

    // ── Safety Nets ──
    process.on('unhandledRejection', (err: Error) => {
        console.error('UNHANDLED REJECTION! 💥 Shutting down...');
        console.error(err.name, err.message);
        server.close(() => process.exit(1));
    });
};

// Start the application
startServer();

process.on('uncaughtException', (err: Error) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});