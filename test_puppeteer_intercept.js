const puppeteer = require('puppeteer');

async function run() {
    console.log('Starting scraper (Network Intercept Mode)...');

    const browser = await puppeteer.launch({
        headless: "new"
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        let inventoryData = null;

        // Listen for responses
        page.on('response', async response => {
            const url = response.url();
            // Match the inventory API
            if (url.includes('inventory/api/v1/results')) {
                console.log('Captured API call:', url);
                try {
                    const data = await response.json();
                    if (data && data.results) {
                        inventoryData = data.results;
                        console.log(`Captured ${data.results.length} vehicles from network.`);
                    }
                } catch (e) {
                    console.log('Failed to parse JSON from intercepted request');
                }
            }
        });

        const url = 'https://www.tesla.com/es_ES/inventory/new/m3';
        console.log(`Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait a bit more if needed for the XHR to fire
        await new Promise(r => setTimeout(r, 5000));

        if (inventoryData) {
            console.log('Success!');
            console.log('Sample VIN:', inventoryData[0].VIN);
            console.log('Sample Price:', inventoryData[0].Price);
        } else {
            console.log('No inventory data captured.');
        }

    } catch (e) {
        console.error('An error occurred:', e);
    } finally {
        await browser.close();
    }
}

run();
