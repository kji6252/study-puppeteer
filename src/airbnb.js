const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://ko.airbnb.com/', {waitUntil: "networkidle0"});
    const pageContent = await page.content();
    console.log('"에어비앤비 추천"이 있나? ', pageContent.indexOf('에어비앤비 추천') >= 0);

    await browser.close();
})();