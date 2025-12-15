const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
    console.log('Starting DOM Debugger...');
    const browser = await puppeteer.launch({ headless: "new" });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        const url = 'https://www.tesla.com/es_ES/inventory/new/m3';
        console.log(`Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for potential client side hydration
        await new Promise(r => setTimeout(r, 5000));

        const content = await page.content();
        fs.writeFileSync('page.html', content);
        console.log('HTML saved to page.html');

    } catch (e) {
        console.error('An error occurred:', e);
    } finally {
        await browser.close();
    }
}

run();
