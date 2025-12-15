const puppeteer = require('puppeteer');

async function run() {
    console.log('Starting Network Debugger...');

    const browser = await puppeteer.launch({
        headless: "new"
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        page.on('request', req => {
            const url = req.url();
            // Filter out images/css/fonts/js to reduce noise, keep likely APIs
            if (!url.match(/\.(png|jpg|jpeg|gif|css|font|woff|woff2|js|svg)/)) {
                console.log('REQ:', url);
            }
        });

        const url = 'https://www.tesla.com/es_ES/inventory/new/m3';
        console.log(`Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait 10 seconds to catch subsequent XHR
        await new Promise(r => setTimeout(r, 10000));

    } catch (e) {
        console.error('An error occurred:', e);
    } finally {
        await browser.close();
    }
}

run();
