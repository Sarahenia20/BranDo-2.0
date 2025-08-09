import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet'; // For securing HTTP headers
import cors from 'cors';

import { runInstagram } from './client/Instagram';
import logger, { setupErrorHandlers } from './config/logger';
import { setup_HandleError } from './utils';
import { connectDB } from './config/db';

// Import routes
import automationRoutes from './routes/automation';
import accountsRoutes from './routes/accounts';
import hashtagRoutes from './routes/hashtags';
import settingsRoutes from './routes/settings';
// import { main as twitterMain } from './client/Twitter'; //
// import { main as githubMain } from './client/GitHub'; // 

// Set up process-level error handlers
setupErrorHandlers();

// Initialize environment variables
dotenv.config();

const app: Application = express();

// Connect to the database
connectDB();

// Middleware setup
app.use(helmet({ xssFilter: true, noSniff: true })); // Security headers

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json()); // JSON body parsing
app.use(express.urlencoded({ extended: true, limit: '1kb' })); // URL-encoded data
app.use(cookieParser()); // Cookie parsing

// API Routes
app.use('/api/automation', automationRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/hashtags', hashtagRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BranDo Social Media API is running',
        timestamp: new Date().toISOString() 
    });
});

// Note: Automation is now controlled via API endpoints
// The continuous loop has been replaced with API-controlled automation
// Use POST /api/automation/start to begin automation
// Use POST /api/automation/stop to stop automation

logger.info("🚀 BranDo Social Media API initialized");
logger.info("📱 Use the frontend Social Media Hub to control automation");
logger.info("🔗 API Endpoints available:");
logger.info("   • GET /api/health - Health check");
logger.info("   • GET /api/accounts - List connected accounts");
logger.info("   • GET /api/automation/status - Check automation status");
logger.info("   • POST /api/automation/start - Start automation");
logger.info("   • POST /api/automation/stop - Stop automation");
logger.info("   • GET /api/hashtags/categories - Business categories");
logger.info("   • GET /api/settings/automation - Automation settings");
logger.info("   • POST /api/settings/hashtags - Update hashtags");

export default app;
