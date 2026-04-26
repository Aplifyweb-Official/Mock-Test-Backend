import mongoose from 'mongoose';
import { ENV } from './env.config.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log(`\n📦 MongoDB Connected Successfully!`);
        console.log(`🔗 Host: ${conn.connection.host}`);
        console.log(`🗄️  Database: ${conn.connection.name}`);
    } catch (error: any) {
        console.error(`\n❌ MongoDB Connection Failed!`);
        console.error(`Error: ${error.message}`);
        process.exit(1); // Agar DB connect nahi hua toh aage badhne ka koi fayda nahi
    }
};