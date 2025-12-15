import puppeteer from 'puppeteer';

export async function scrapeTeslaInventory(model = 'm3', market = 'ES') {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // URL for the inventory API which returns JSON directly, 
    // but acts like it's being hit by a browser if we drive it right.
    // Actually, let's try navigating to the page and intercepting the API response
    // or just parsing the INITIAL_STATE if it exists, or just the API endpoint with cookies.

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // We go to the main inventory page to get cookies/tokens
        await page.goto(`https://www.tesla.com/${market.toLowerCase()}_${market}/inventory/new/${model}`, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Now we can try to fetch the API context or look for the data in the page.
        // Tesla often puts data in window.tesla including inventory.

        const inventoryData = await page.evaluate(() => {
            // @ts-ignore
            return window.tesla?.inventory?.results || [];
        });

        // If that fails, we might need to intercept the API call the page makes.
        // For now, let's return what we found.
        return inventoryData;

    } catch (e) {
        console.error("Scraping error:", e);
        return [];
    } finally {
        await browser.close();
    }
}
