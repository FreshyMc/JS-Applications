const { chromium } = require('playwright-chromium');
const { assert } = require('chai');

let host = 'http://127.0.0.1:5500/';

let browser, context, page;

describe('test 01', function () {
    this.timeout(16000);

    before(async () => {
        // browser = await chromium.launch({ headless: false, slowMo: 500 });
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();

        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    it('test get messages', async () => {
        await page.goto(host);

        await page.waitForSelector('#refresh');

        const [response] = await Promise.all([
            page.waitForResponse('http://localhost:3030/jsonstore/messenger'),
            page.click('text=Refresh')
        ]);

        let status = response.status();

        assert.equal(status, 200);

        let messages = await page.$eval('#messages', el => {
            return el.value.split('\n');
        });

        assert.deepEqual(messages, ['Spami: Hello, are you there?',
            'Garry: Yep, whats up :?',
            'Spami: How are you? Long time no see? :)',
            'George: Hello, guys! :))',
            'Spami: Hello, George nice to see you! :)))']);
    });

    it('test send message', async () => {
        await page.goto(host);

        await page.waitForLoadState('domcontentloaded');

        let author = 'User';
        let content = 'Test message';

        await page.fill('#author', author);
        await page.fill('#content', content);

        let [request] = await Promise.all([
            page.waitForRequest(request => request.url() === 'http://localhost:3030/jsonstore/messenger' && request.method() === 'POST'),
            page.click('text=Send')
        ]);

        assert.deepEqual(request.postDataJSON(), {author, content});
    });
});