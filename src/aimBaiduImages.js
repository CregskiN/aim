const puppeteer = require('puppeteer');
const {aimBaiduImages} = require('./config/default');
const srcToImg = require('./config/helper/srcToImg');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { // 默认窗口大小
            width: 2560,
            height: 1440
        }
    });
    const page = await browser.newPage();

    // 设置网址 进入页面
    await page.goto('http://image.baidu.com/');
    console.log('go to http://image.baidu.com/');

    // 设置窗口大小
    await page.setViewport({width: 2560, height: 1440});
    console.log('reset viewport');

    // focus 输入框 // 输入字符 // 触发点击事件
    await page.focus('#kw');
    await page.keyboard.sendCharacter('狗');
    await page.evaluate(() => {
        document.querySelector('.s_btn').click();
    });
    console.log('click! go to search list');

    page.on('load', async () => {
        console.log('page loading done! start fetch...');

        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images, img => img.src);
        });
        console.log(`get ${srcs.length} images, start download`);

        srcs.forEach( async (src) => {
             await page.waitFor(700); // !! 一定加这个，不然会被百度反爬虫机制屏蔽掉
             await srcToImg(src, aimBaiduImages);

        });

        await browser.close();
    });


})();