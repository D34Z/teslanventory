const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

async function run() {
    console.log('Starting STEALTH Scraper...');

    // Launch browser
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"'
        ],
        ignoreHTTPSErrors: true
    });

    try {
        const page = await browser.newPage();

        // Randomize viewport
        await page.setViewport({ width: 1920 + Math.floor(Math.random() * 100), height: 1080 + Math.floor(Math.random() * 100) });

        const url = 'https://www.tesla.com/es_ES/inventory/new/m3';
        console.log(`Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

        await new Promise(r => setTimeout(r, 8000)); // Wait for render

        const content = await page.content();
        fs.writeFileSync('page_stealth.html', content);

        if (content.includes("Access Denied")) {
            console.log("FAILURE: Still Access Denied");
        } else {
            console.log("SUCCESS: Page loaded!");

            // Try to find ANY inventory data
            if (content.includes("inventory")) {
                console.log("Found 'inventory' keyword in HTML");
            }
        }

    } catch (e) {
        console.error('An error occurred:', e);
    } finally {
        await browser.close();
    }
}

run();
