const puppeteer = require('puppeteer');
const {screenshot} = require('./config/default');


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await puppeteer.launch({
        headless: false
    }); // default is true
    await page.goto('https://www.baidu.com');
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await page.screenshot({
        path: `${screenshot}/${Date.now()}.png`
    });
    await browser.close();
})();