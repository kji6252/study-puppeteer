const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    // 네이버 로그인 페이지 접근
    await page.goto('https://nid.naver.com/nidlogin.login?svctype=262144&url=http://m.naver.com/aside/')

    // 네이버 로그인 (기호에 맞춰 수정하세요)
    await page.type('#id', '네이버 아이디', {delay: 100})
    await page.type('#pw', '네이버 비밀번호', {delay: 100})
    await page.click('[type="submit"]')
    await page.waitForNavigation()

    // 네이버 카페 게시판 접속 (기호에 맞춰 수정하세요)
    await page.goto('https://m.cafe.naver.com/ArticleList.nhn?search.clubid=29734529&search.menuid=1&search.boardtype=L')

    // 자유게시판 글 Scraping
    const articles = await page.evaluate(args => {
        const articles = []
        document.querySelectorAll('#articleListArea > ul li')
            .forEach((v, i) => {
                const article = {}
                article.title = v.querySelector('.tit').innerText
                article.nick = v.querySelector('.nick').innerText
                article.href = v.querySelector('a._articleListItem').href
                articles.push(article)
            })
        return articles
    })

    // 자유게시판 글들 확인
    console.log(articles)

    //새탭을 Open 후 각 게시글의 href에 방문 하여 게시글 내용을 가져옴
    const articlePage = await browser.newPage()
    for (let article of articles) {
        await articlePage.goto(article.href)
        const content = await articlePage.$eval('#postContent', element => element.innerText)
        article.content = content;
    }

    // 자유게시판 글들을 내용까지 채움
    console.log(articles)

    await browser.close()
})();