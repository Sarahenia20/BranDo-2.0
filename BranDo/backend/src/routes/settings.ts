import { Router, Request, Response } from 'express';
import logger from '../config/logger';

const router = Router();

// Global automation settings storage (in production, this would be in database)
let automationSettings = {
    selectedHashtags: [] as string[],
    businessCategory: '',
    automationRules: {
        likesPerHour: 20,
        commentsPerHour: 5,
        followsPerHour: 10,
        maxPostsPerHashtag: 10
    },
    contentStrategy: {
        commentStyle: 'professional', // professional, casual, enthusiastic
        engagementLevel: 'medium', // low, medium, high
        targetAudience: 'general'
    },
    schedule: {
        activeHours: {
            start: '09:00',
            end: '17:00'
        },
        timezone: 'UTC',
        activeDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }
};

/**
 * GET /api/settings/automation
 * Get current automation settings
 */
router.get('/automation', (_req: Request, res: Response) => {
    try {
        logger.info('Fetching automation settings');
        return res.json(automationSettings);
    } catch (error) {
        logger.error('Error fetching automation settings:', error);
        return res.status(500).json({ error: 'Failed to fetch automation settings' });
    }
});

/**
 * PUT /api/settings/automation
 * Update automation settings
 */
router.put('/automation', (req: Request, res: Response) => {
    try {
        const { 
            selectedHashtags, 
            businessCategory, 
            automationRules, 
            contentStrategy, 
            schedule 
        } = req.body;

        // Update settings (with validation)
        if (selectedHashtags) {
            if (!Array.isArray(selectedHashtags)) {
                return res.status(400).json({ error: 'selectedHashtags must be an array' });
            }
            automationSettings.selectedHashtags = selectedHashtags as string[];
        }

        if (businessCategory) {
            automationSettings.businessCategory = businessCategory;
        }

        if (automationRules) {
            automationSettings.automationRules = {
                ...automationSettings.automationRules,
                ...automationRules
            };
        }

        if (contentStrategy) {
            automationSettings.contentStrategy = {
                ...automationSettings.contentStrategy,
                ...contentStrategy
            };
        }

        if (schedule) {
            automationSettings.schedule = {
                ...automationSettings.schedule,
                ...schedule
            };
        }

        logger.info('Updated automation settings:', automationSettings);
        return res.json({
            message: 'Automation settings updated successfully',
            settings: automationSettings
        });
    } catch (error) {
        logger.error('Error updating automation settings:', error);
        return res.status(500).json({ error: 'Failed to update automation settings' });
    }
});

/**
 * POST /api/settings/hashtags
 * Update selected hashtags for automation
 */
router.post('/hashtags', (req: Request, res: Response) => {
    try {
        const { hashtags, category } = req.body;

        if (!hashtags || !Array.isArray(hashtags)) {
            return res.status(400).json({ error: 'Hashtags array is required' });
        }

        automationSettings.selectedHashtags = hashtags as string[];
        if (category) {
            automationSettings.businessCategory = category;
        }

        logger.info(`Updated hashtags: ${hashtags.length} hashtags selected for category: ${category}`);
        return res.json({
            message: 'Hashtags updated successfully',
            selectedHashtags: automationSettings.selectedHashtags,
            businessCategory: automationSettings.businessCategory
        });
    } catch (error) {
        logger.error('Error updating hashtags:', error);
        return res.status(500).json({ error: 'Failed to update hashtags' });
    }
});

/**
 * GET /api/settings/hashtags
 * Get current selected hashtags
 */
router.get('/hashtags', (_req: Request, res: Response) => {
    try {
        return res.json({
            selectedHashtags: automationSettings.selectedHashtags,
            businessCategory: automationSettings.businessCategory,
            count: automationSettings.selectedHashtags.length
        });
    } catch (error) {
        logger.error('Error fetching hashtags:', error);
        return res.status(500).json({ error: 'Failed to fetch hashtags' });
    }
});

// Export the settings for use in automation
export { automationSettings };
export default router;