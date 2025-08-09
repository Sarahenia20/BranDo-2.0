import { Router, Request, Response } from 'express';
import logger from '../config/logger';

const router = Router();

// Business categories with suggested hashtags
const BUSINESS_CATEGORIES = {
    'ecommerce': {
        name: 'E-commerce & Retail',
        hashtags: [
            '#ecommerce', '#onlineshopping', '#retail', '#fashion', '#style',
            '#sale', '#shopping', '#product', '#brand', '#boutique',
            '#smallbusiness', '#entrepreneur', '#onlinestore', '#deals', '#newcollection'
        ]
    },
    'food': {
        name: 'Food & Restaurants',
        hashtags: [
            '#foodie', '#restaurant', '#food', '#delicious', '#yummy',
            '#chef', '#cooking', '#foodporn', '#instafood', '#foodlover',
            '#fresh', '#organic', '#healthy', '#tasty', '#homemade'
        ]
    },
    'fitness': {
        name: 'Fitness & Wellness',
        hashtags: [
            '#fitness', '#gym', '#workout', '#health', '#wellness',
            '#training', '#motivation', '#fit', '#strong', '#healthy',
            '#yoga', '#cardio', '#strength', '#transformation', '#lifestyle'
        ]
    },
    'beauty': {
        name: 'Beauty & Skincare',
        hashtags: [
            '#beauty', '#skincare', '#makeup', '#cosmetics', '#glowup',
            '#selfcare', '#beautiful', '#natural', '#organic', '#antiaging',
            '#skincareRoutine', '#beautytips', '#makeupartist', '#glow', '#cleanskin'
        ]
    },
    'tech': {
        name: 'Technology & Software',
        hashtags: [
            '#tech', '#technology', '#software', '#app', '#innovation',
            '#digital', '#startup', '#coding', '#ai', '#saas',
            '#productivity', '#tools', '#development', '#automation', '#future'
        ]
    },
    'travel': {
        name: 'Travel & Tourism',
        hashtags: [
            '#travel', '#vacation', '#wanderlust', '#adventure', '#explore',
            '#tourism', '#trip', '#holiday', '#destination', '#travelphotography',
            '#backpacking', '#culture', '#nature', '#beach', '#mountains'
        ]
    },
    'education': {
        name: 'Education & Learning',
        hashtags: [
            '#education', '#learning', '#study', '#knowledge', '#school',
            '#university', '#teaching', '#student', '#academic', '#research',
            '#onlinelearning', '#skills', '#training', '#course', '#development'
        ]
    },
    'realestate': {
        name: 'Real Estate',
        hashtags: [
            '#realestate', '#property', '#home', '#house', '#investment',
            '#realtor', '#listing', '#forsale', '#dreamhome', '#luxury',
            '#apartment', '#commercial', '#residential', '#market', '#broker'
        ]
    },
    'automotive': {
        name: 'Automotive',
        hashtags: [
            '#cars', '#automotive', '#auto', '#vehicle', '#driving',
            '#luxury', '#performance', '#mechanic', '#garage', '#tuning',
            '#classic', '#electric', '#racing', '#carlife', '#automobile'
        ]
    },
    'photography': {
        name: 'Photography & Creative',
        hashtags: [
            '#photography', '#photographer', '#photo', '#art', '#creative',
            '#portrait', '#landscape', '#studio', '#wedding', '#event',
            '#photooftheday', '#capture', '#lens', '#camera', '#visual'
        ]
    }
};

/**
 * GET /api/hashtags/categories
 * Get all business categories with suggested hashtags
 */
router.get('/categories', (_req: Request, res: Response) => {
    try {
        const categories = Object.entries(BUSINESS_CATEGORIES).map(([key, value]) => ({
            id: key,
            name: value.name,
            hashtags: value.hashtags,
            count: value.hashtags.length
        }));

        logger.info(`Returning ${categories.length} business categories`);
        return res.json(categories);
    } catch (error) {
        logger.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

/**
 * GET /api/hashtags/suggestions/:category
 * Get hashtag suggestions for a specific category
 */
router.get('/suggestions/:category', (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const categoryData = BUSINESS_CATEGORIES[category as keyof typeof BUSINESS_CATEGORIES];

        if (!categoryData) {
            return res.status(404).json({ error: 'Category not found' });
        }

        logger.info(`Returning hashtags for category: ${category}`);
        return res.json({
            category: categoryData.name,
            hashtags: categoryData.hashtags
        });
    } catch (error) {
        logger.error('Error fetching hashtag suggestions:', error);
        return res.status(500).json({ error: 'Failed to fetch hashtag suggestions' });
    }
});

/**
 * POST /api/hashtags/smart-suggest
 * AI-powered hashtag suggestions based on business description
 */
router.post('/smart-suggest', async (req: Request, res: Response) => {
    try {
        const { businessDescription } = req.body;

        if (!businessDescription) {
            return res.status(400).json({ error: 'Business description is required' });
        }

        // Here you could integrate with your AI agent to generate smart hashtags
        // For now, let's use a simple keyword-based approach
        const keywords = businessDescription.toLowerCase().split(' ');
        const suggestedHashtags = [];

        // Match keywords with categories
        for (const [categoryKey, categoryData] of Object.entries(BUSINESS_CATEGORIES)) {
            const categoryKeywords = categoryData.name.toLowerCase().split(/[\s&]+/);
            
            if (keywords.some((keyword: string) => categoryKeywords.some(ck => ck.includes(keyword) || keyword.includes(ck)))) {
                suggestedHashtags.push(...categoryData.hashtags.slice(0, 5)); // Take top 5 from each matching category
            }
        }

        // Remove duplicates and limit to 15 hashtags
        const uniqueHashtags = [...new Set(suggestedHashtags)].slice(0, 15);

        logger.info(`Generated ${uniqueHashtags.length} smart hashtag suggestions`);
        return res.json({
            businessDescription,
            suggestedHashtags: uniqueHashtags,
            count: uniqueHashtags.length
        });
    } catch (error) {
        logger.error('Error generating smart hashtag suggestions:', error);
        return res.status(500).json({ error: 'Failed to generate hashtag suggestions' });
    }
});

export default router;