const puppeteer = require('puppeteer');

async function run() {
    console.log('Starting scraper...');

    // Launch browser
    const browser = await puppeteer.launch({
        headless: "new"
    });

    try {
        const page = await browser.newPage();

        // Anti-bot measures
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Target: Tesla Spain Model 3 New
        const url = 'https://www.tesla.com/es_ES/inventory/new/m3';
        console.log(`Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for inventory data to populate
        // Tesla stores data in window.tesla.inventory.results often
        const results = await page.evaluate(() => {
            try {
                // @ts-ignore
                if (window.tesla && window.tesla.inventory && window.tesla.inventory.results) {
                    // @ts-ignore
                    return window.tesla.inventory.results;
                }
                return "window.tesla.inventory.results not found";
            } catch (e) {
                return e.toString();
            }
        });

        console.log('Scan complete.');
        if (Array.isArray(results)) {
            console.log(`Found ${results.length} vehicles.`);
            if (results.length > 0) {
                console.log('First vehicle VIN:', results[0].VIN);
                console.log('First vehicle Price:', results[0].Price);
            }
        } else {
            console.log('Result:', results);
        }

    } catch (e) {
        console.error('An error occurred:', e);
    } finally {
        await browser.close();
    }
}

run();
