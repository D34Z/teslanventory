const { scrapeTeslaInventory } = require('./src/services/scraper'); // We need to fix imports for running this directly possibly
// Actually, since it's TS, we can't run it directly with node easily without compiling or ts-node.
// Let's make a temporary JS file for testing or use ts-node if available.
// I'll make a pure JS version for the test to avoid toolchain issues right now.

const puppeteer = require('puppeteer');

async function run() {
    console.log('Starting scraper...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        const url = 'https://www.tesla.com/es_ES/inventory/new/m3';
        console.log(`Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the grid of cars to load
        await page.waitForSelector('.result-header', { timeout: 10000 }).catch(() => console.log('Header not found'));

        // Extract using DOM query just in case internal API is hidden
        const cars = await page.evaluate(() => {
            const results = [];
            // Try to find the JSON script tag which is common in React/Next/Nuxt apps
            // Or look for window.tesla
            // @ts-ignore
            if (window.tesla && window.tesla.inventory && window.tesla.inventory.results) {
                // @ts-ignore
                return window.tesla.inventory.results;
            }
            return [];
        });

        console.log(`Found ${cars.length} cars.`);
        if (cars.length > 0) {
            console.log('Sample:', cars[0]);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

run();
