const puppeteer = require('puppeteer-core');

(async () => {
    const id = '';
    const password = '';
    const courseURL = 'https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%EC%BD%94%ED%8B%80%EB%A6%B0';
    try {
        const browser = await puppeteer.launch(
            {
                executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                headless: false,
                defaultViewport: null
            });
        const page = (await browser.pages())[0];

        // 로그인
        await page.goto('https://www.inflearn.com/');
        await page.waitForSelector('#header > nav > div.container.desktop_container > div > div.navbar-menu > div.navbar-right > div.navbar-item.buttons > a.button.space-inset-4.signin');
        await page.click('#header > nav > div.container.desktop_container > div > div.navbar-menu > div.navbar-right > div.navbar-item.buttons > a.button.space-inset-4.signin', {delay: 1000});
        await page.type('#root > div.modal > article > form > div > input', id);
        await page.type('#root > div.modal > article > form > div > div > input', password);
        await page.click('#root > div.modal > article > form > button', {delay: 1000});
        await page.waitForNavigation({waitUntil: 'networkidle2'});

        // 코스 이동
        await page.goto(courseURL);
        await page.waitForSelector('#main > section > div.cd-sticky-wrapper > div > div > div > div.cd-header__left.ac-cd-6.ac-ct-12 > div > div > div')

        // 수강
        await page.click('#main > section > div.cd-sticky-wrapper > div > div > div > div.cd-header__left.ac-cd-6.ac-ct-12 > div > div > div', {delay: 1000});
        await page.waitForNavigation({waitUntil: 'networkidle2'});

        // 수강 목록
        await page.click('#root > div > ul > li:nth-child(1) > button', {delay: 1000});
        await page.waitForSelector('#root > aside > div > ul > li');

        // 비수강 목록 가져오기
        const unCompletedHandles = await page.evaluateHandle(()=> {
            return [...document.querySelectorAll('#root > aside > div > ul > li > ul > li > span')].filter(s => getComputedStyle(s).getPropertyValue('background-color') === 'rgb(206, 212, 218)')
        })
        const unCompletes = [...(await unCompletedHandles.getProperties()).values()];

        // 비수강 봤어요 버튼 클릭
        for (let unComplete of unCompletes) {
            unComplete.click({delay: 1000});
            await page.waitForSelector('#root > main > div > footer > div > span > span > button');
            if (await page.$('#root > main > div > footer > div > span > span > button') !== null) {
                await page.click('#root > main > div > footer > div > span > span > button', {delay: 1000});
                await page.waitForResponse('https://www.inflearn.com/api/v1/complete');
            }
        }

        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();