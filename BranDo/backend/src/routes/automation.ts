import { Router, Request, Response } from 'express';
import logger from '../config/logger';

const router = Router();

// Global state to track automation status
let automationState = {
    isRunning: false,
    lastStarted: null as Date | null,
    lastStopped: null as Date | null
};

// Store the automation interval
let automationInterval: NodeJS.Timeout | null = null;

// Import the Instagram automation functions
import { runInstagram } from '../client/Instagram';
import { runHashtagAutomation } from '../client/InstagramHashtag';
import { automationSettings } from './settings';

/**
 * GET /api/automation/status
 * Returns the current status of the automation
 */
router.get('/status', (_req: Request, res: Response) => {
    try {
        res.json({
            isRunning: automationState.isRunning,
            lastStarted: automationState.lastStarted,
            lastStopped: automationState.lastStopped,
            uptime: automationState.isRunning && automationState.lastStarted 
                ? Date.now() - automationState.lastStarted.getTime() 
                : 0
        });
    } catch (error) {
        logger.error('Error getting automation status:', error);
        res.status(500).json({ error: 'Failed to get automation status' });
    }
});

/**
 * POST /api/automation/start
 * Starts the automation process
 */
router.post('/start', async (_req: Request, res: Response) => {
    try {
        if (automationState.isRunning) {
            return res.json({
                message: 'Automation is already running',
                status: automationState
            });
        }

        // Start the automation
        automationState.isRunning = true;
        automationState.lastStarted = new Date();
        
        logger.info('Starting Instagram automation via API...');

        // Choose automation type based on settings
        const useHashtagAutomation = automationSettings.selectedHashtags && automationSettings.selectedHashtags.length > 0;
        
        // Run automation in intervals
        const runAutomationCycle = async () => {
            if (!automationState.isRunning) return;
            
            try {
                if (useHashtagAutomation) {
                    logger.info('Starting hashtag-based Instagram automation...');
                    logger.info(`Using hashtags: ${automationSettings.selectedHashtags.join(', ')}`);
                    await runHashtagAutomation();
                    logger.info('Hashtag automation cycle finished.');
                } else {
                    logger.info('Starting Instagram agent iteration (home feed)...');
                    await runInstagram();
                    logger.info('Instagram agent iteration finished.');
                }
            } catch (error) {
                logger.error('Error in automation cycle:', error);
            }

            // Schedule next iteration if still running (longer interval for hashtag automation)
            if (automationState.isRunning) {
                const nextInterval = useHashtagAutomation ? 300000 : 30000; // 5 minutes vs 30 seconds
                automationInterval = setTimeout(runAutomationCycle, nextInterval);
            }
        };

        // Start the first cycle
        runAutomationCycle();

        return res.json({
            message: 'Automation started successfully',
            status: {
                isRunning: automationState.isRunning,
                lastStarted: automationState.lastStarted
            }
        });

    } catch (error) {
        logger.error('Error starting automation:', error);
        automationState.isRunning = false;
        return res.status(500).json({ error: 'Failed to start automation' });
    }
});

/**
 * POST /api/automation/stop
 * Stops the automation process
 */
router.post('/stop', (_req: Request, res: Response) => {
    try {
        if (!automationState.isRunning) {
            return res.json({
                message: 'Automation is not running',
                status: automationState
            });
        }

        // Stop the automation
        automationState.isRunning = false;
        automationState.lastStopped = new Date();
        
        // Clear the interval if it exists
        if (automationInterval) {
            clearTimeout(automationInterval);
            automationInterval = null;
        }

        logger.info('Automation stopped via API');

        return res.json({
            message: 'Automation stopped successfully',
            status: {
                isRunning: automationState.isRunning,
                lastStopped: automationState.lastStopped
            }
        });

    } catch (error) {
        logger.error('Error stopping automation:', error);
        return res.status(500).json({ error: 'Failed to stop automation' });
    }
});

export default router;