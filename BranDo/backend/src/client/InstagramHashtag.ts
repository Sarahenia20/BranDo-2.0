import { Browser, DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import UserAgent from "user-agents";
import { Server } from "proxy-chain";
import { IGpassword, IGusername } from "../secret";
import logger from "../config/logger";
import { Instagram_cookiesExist, loadCookies, saveCookies } from "../utils";
import { runAgent } from "../Agent";
import { getInstagramCommentSchema } from "../Agent/schema";
import { automationSettings } from "../routes/settings";

// Add stealth plugin to puppeteer
puppeteer.use(StealthPlugin());
puppeteer.use(
    AdblockerPlugin({
        interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
    })
);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runHashtagAutomation() {
    // Check if hashtags are configured
    if (!automationSettings.selectedHashtags || automationSettings.selectedHashtags.length === 0) {
        logger.warn('No hashtags configured for automation. Please configure hashtags in the dashboard.');
        return;
    }

    logger.info(`Starting hashtag automation with ${automationSettings.selectedHashtags.length} hashtags`);
    
    const server = new Server({ port: 8001 });
    await server.listen();
    const proxyUrl = `http://localhost:8001`;
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--proxy-server=${proxyUrl}`],
    });

    const page = await browser.newPage();
    const cookiesPath = "./cookies/Instagramcookies.json";

    try {
        // Login process (same as before)
        const checkCookies = await Instagram_cookiesExist();
        logger.info(`Checking cookies existence: ${checkCookies}`);

        if (checkCookies) {
            const cookies = await loadCookies(cookiesPath);
            await page.setCookie(...cookies);
            logger.info('Cookies loaded and set on the page.');

            await page.goto("https://www.instagram.com/", { waitUntil: 'networkidle2' });
            const isLoggedIn = await page.$("a[href='/direct/inbox/']");
            
            if (isLoggedIn) {
                logger.info("Login verified with cookies.");
            } else {
                logger.warn("Cookies invalid or expired. Logging in again...");
                await loginWithCredentials(page, browser);
            }
        } else {
            await loginWithCredentials(page, browser);
        }

        await page.screenshot({ path: "hashtag_automation_start.png" });

        // Start hashtag-based automation
        for (const hashtag of automationSettings.selectedHashtags) {
            await processHashtag(page, hashtag);
            
            // Wait between hashtags to avoid rate limiting
            const waitTime = Math.floor(Math.random() * 30000) + 60000; // 1-1.5 minutes
            logger.info(`Waiting ${waitTime / 1000} seconds before processing next hashtag...`);
            await delay(waitTime);
        }

        logger.info('Hashtag automation cycle completed');
        
    } catch (error) {
        logger.error('Error in hashtag automation:', error);
    } finally {
        await browser.close();
        await server.close(true);
    }
}

const loginWithCredentials = async (page: any, _browser: Browser) => {
    try {
        await page.goto("https://www.instagram.com/accounts/login/");
        await page.waitForSelector('input[name="username"]', { timeout: 10000 });

        await page.type('input[name="username"]', IGusername);
        await page.type('input[name="password"]', IGpassword);
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ timeout: 30000 });

        const cookies = await page.cookies();
        await saveCookies("./cookies/Instagramcookies.json", cookies);
        logger.info('Login successful and cookies saved');
    } catch (error) {
        logger.error("Error logging in with credentials:", error);
        throw error;
    }
}

const processHashtag = async (page: any, hashtag: string) => {
    try {
        const cleanHashtag = hashtag.replace('#', '');
        const hashtagUrl = `https://www.instagram.com/explore/tags/${cleanHashtag}/`;
        
        logger.info(`Processing hashtag: ${hashtag}`);
        await page.goto(hashtagUrl, { waitUntil: 'networkidle2' });
        await delay(3000);

        // Click on "Recent" tab to get fresh posts
        const recentTabSelector = 'a[href*="recent"]';
        const recentTab = await page.$(recentTabSelector);
        if (recentTab) {
            await recentTab.click();
            await delay(2000);
        }

        // Get recent posts
        const postSelectors = 'article div div div div a[href*="/p/"]';
        const posts = await page.$$(postSelectors);
        
        if (posts.length === 0) {
            logger.warn(`No posts found for hashtag: ${hashtag}`);
            return;
        }

        const maxPostsToProcess = Math.min(posts.length, automationSettings.automationRules.maxPostsPerHashtag);
        logger.info(`Found ${posts.length} posts for ${hashtag}, processing ${maxPostsToProcess}`);

        // Process posts
        for (let i = 0; i < maxPostsToProcess; i++) {
            try {
                await processPost(page, posts[i], hashtag, i + 1);
                
                // Random delay between posts (5-15 seconds)
                const postDelay = Math.floor(Math.random() * 10000) + 5000;
                await delay(postDelay);
                
            } catch (postError) {
                logger.error(`Error processing post ${i + 1} for hashtag ${hashtag}:`, postError);
                continue;
            }
        }

    } catch (error) {
        logger.error(`Error processing hashtag ${hashtag}:`, error);
    }
}

const processPost = async (page: any, postElement: any, hashtag: string, postIndex: number) => {
    try {
        // Click on post to open it
        await postElement.click();
        await delay(3000);

        // Wait for post to load
        await page.waitForSelector('article', { timeout: 10000 });

        // Like the post
        const likeButtonSelector = 'svg[aria-label="Like"]';
        const likeButton = await page.$(likeButtonSelector);
        
        if (likeButton) {
            await likeButton.click();
            logger.info(`✅ Liked post ${postIndex} from hashtag ${hashtag}`);
            await delay(1000);
        }

        // Get post caption for AI comment generation
        let caption = '';
        const captionSelectors = [
            'article div div div div span',
            'article span._ap3a',
            '[data-testid="post-caption"]'
        ];

        for (const selector of captionSelectors) {
            try {
                const captionElement = await page.$(selector);
                if (captionElement) {
                    caption = await captionElement.evaluate((el: HTMLElement) => el.innerText);
                    if (caption && caption.length > 10) break;
                }
            } catch (e) {
                continue;
            }
        }

        // Generate and post comment
        if (caption && automationSettings.automationRules.commentsPerHour > 0) {
            await postAIComment(page, caption, hashtag, postIndex);
        }

        // Close the post by pressing Escape or clicking close
        await page.keyboard.press('Escape');
        await delay(2000);

    } catch (error) {
        logger.error(`Error in processPost:`, error);
        // Try to close any open dialogs
        await page.keyboard.press('Escape');
        await delay(1000);
    }
}

const postAIComment = async (page: any, caption: string, hashtag: string, postIndex: number) => {
    try {
        // Find comment box
        const commentBoxSelectors = [
            'textarea[placeholder*="comment"]',
            'textarea[aria-label*="comment"]',
            'div[contenteditable="true"][role="textbox"]'
        ];

        let commentBox = null;
        for (const selector of commentBoxSelectors) {
            commentBox = await page.$(selector);
            if (commentBox) break;
        }

        if (!commentBox) {
            logger.warn(`Comment box not found for post ${postIndex} from ${hashtag}`);
            return;
        }

        // Generate AI comment
        const businessContext = automationSettings.businessCategory 
            ? `I run a ${automationSettings.businessCategory} business.` 
            : '';
        
        const prompt = `${businessContext} Craft a genuine, engaging comment for this Instagram post: "${caption}". 
        The comment should be:
        - Authentic and relevant to the post content
        - Professional but friendly
        - Max 100 characters
        - Add value to the conversation
        - Avoid spam-like language
        - Don't use excessive emojis or hashtags
        Style: ${automationSettings.contentStrategy.commentStyle}`;

        const schema = getInstagramCommentSchema();
        const result = await runAgent(schema, prompt);
        const comment = result[0]?.comment;

        if (!comment) {
            logger.warn(`No comment generated for post ${postIndex} from ${hashtag}`);
            return;
        }

        // Type the comment
        await commentBox.click();
        await delay(500);
        await commentBox.type(comment, { delay: 50 });

        // Find and click Post button
        const postButtonSelectors = [
            'button[type="submit"]',
            'div[role="button"]:has-text("Post")',
            'button:has-text("Post")'
        ];

        let postButton = null;
        for (const selector of postButtonSelectors) {
            try {
                postButton = await page.$(selector);
                if (postButton) {
                    const isEnabled = await postButton.evaluate((btn: Element) => !btn.hasAttribute('disabled'));
                    if (isEnabled) break;
                }
                postButton = null;
            } catch (e) {
                continue;
            }
        }

        if (postButton) {
            await postButton.click();
            logger.info(`💬 Posted comment on post ${postIndex} from ${hashtag}: "${comment}"`);
            await delay(2000);
        } else {
            logger.warn(`Post button not found or disabled for post ${postIndex}`);
        }

    } catch (error) {
        logger.error(`Error posting AI comment:`, error);
    }
}

export { runHashtagAutomation };