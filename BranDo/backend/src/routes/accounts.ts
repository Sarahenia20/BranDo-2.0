import { Router, Request, Response } from 'express';
import logger from '../config/logger';

const router = Router();

/**
 * GET /api/accounts
 * Returns the list of connected social media accounts
 */
router.get('/', (_req: Request, res: Response) => {
    try {
        // For now, return mock data based on your .env Instagram credentials
        // In a real app, this would come from your database
        const accounts = [
            {
                id: 1,
                username: process.env.IG_USERNAME || 'brando_sos',
                platform: 'Instagram',
                status: 'connected',
                posts: 0, // You can fetch this from Instagram API if needed
                followers: 0, // You can fetch this from Instagram API if needed
                lastActive: new Date().toISOString(),
                createdAt: new Date().toISOString()
            }
        ];

        logger.info(`Returning ${accounts.length} connected accounts`);
        res.json(accounts);

    } catch (error) {
        logger.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

/**
 * POST /api/accounts
 * Add a new social media account
 */
router.post('/', (req: Request, res: Response) => {
    try {
        const { username, platform, password } = req.body;

        if (!username || !platform || !password) {
            return res.status(400).json({ 
                error: 'Username, platform, and password are required' 
            });
        }

        // In a real app, you would:
        // 1. Validate the credentials with the social media platform
        // 2. Store the account in your database (encrypted)
        // 3. Return the created account

        const newAccount = {
            id: Date.now(), // Simple ID generation
            username,
            platform,
            status: 'connected',
            posts: 0,
            followers: 0,
            lastActive: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        logger.info(`New account added: ${username} on ${platform}`);
        return res.status(201).json(newAccount);

    } catch (error) {
        logger.error('Error adding account:', error);
        return res.status(500).json({ error: 'Failed to add account' });
    }
});

/**
 * DELETE /api/accounts/:id
 * Remove a social media account
 */
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // In a real app, you would:
        // 1. Find the account in your database
        // 2. Remove it securely
        // 3. Log out from the platform if needed

        logger.info(`Account ${id} removed`);
        return res.json({ message: 'Account removed successfully', id });

    } catch (error) {
        logger.error('Error removing account:', error);
        return res.status(500).json({ error: 'Failed to remove account' });
    }
});

export default router;