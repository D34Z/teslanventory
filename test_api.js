const fetch = require('node-fetch');

async function testTeslaApi() {
    const url = 'https://www.tesla.com/inventory/api/v1/results?query={"query":{"model":"m3","condition":"new","options":{},"arrangeby":"Relevance","order":"asc","market":"ES","language":"es","super_region":"north america","lng":-3.7037902,"lat":40.4167754,"zip":"28013","range":0},"offset":0,"count":50,"outsideOffset":0,"outsideCount":0}';

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                'Referer': 'https://www.tesla.com/es_ES/inventory/new/m3',
                'Origin': 'https://www.tesla.com',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });

        if (!response.ok) {
            // console.error(`Error: ${response.status} ${response.statusText}`);
            // const text = await response.text();
            // console.error('Response body:', text.substring(0, 200));
            throw new Error(`Status ${response.status}`);
        }

        const data = await response.json();
        console.log('Success! Total Matches:', data.total_matches_found);
        if (data.results.length > 0) {
            console.log('Sample VIN:', data.results[0].VIN);
        }

    } catch (error) {
        console.error('Fetch failed:', error.message);
    }
}

testTeslaApi();
