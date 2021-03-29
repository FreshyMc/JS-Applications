const { chromium } = require('playwright-chromium');
const { assert } = require('chai');

let host = 'http://127.0.0.1:5500/';

let browser, context, page;

describe('test 02', function () {
    this.timeout(16000);

    before(async () => {
        //browser = await chromium.launch({ headless: false, slowMo: 500 });
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

    it('test loading books', async () => {
        await page.goto(host);
        await page.click('#loadBooks');

        await page.waitForSelector('tbody >> tr');

        let books = await page.$$eval('tbody >> tr', elements => {
            return elements.reduce((acc, el) => {
                let [titleEl, authorEl] = el.querySelectorAll('td');

                acc.push({ title: titleEl.textContent, author: authorEl.textContent });

                return acc;
            }, []);
        });

        assert.deepEqual(books[0], {
            title: 'Harry Potter and the Philosopher\'s Stone',
            author: 'J.K.Rowling'
        });

        assert.deepEqual(books[1], {
            title: 'C# Fundamentals', author: 'Svetlin Nakov'
        });
    });

    it('test edit of a book', async () => {
        await page.goto(host);

        let [loadResponse] = await Promise.all([
            page.waitForResponse('http://localhost:3030/jsonstore/collections/books'),
            page.click('text=load all books'),
        ]);

        await page.click('tbody tr:first-child >> text=edit');

        let author = 'TestAuthor';
        let title = 'TestTitle';

        await page.waitForSelector('#editForm');

        await page.fill('#editForm >> input[name="title"]', title);
        await page.fill('#editForm >> input[name="author"]', author);

        await page.click('text=save');
        
        let [loadBooks] = await Promise.all([
            page.waitForResponse('http://localhost:3030/jsonstore/collections/books'),
            page.click('text=load all books'),
        ]);

        let tableContent = await page.$$eval('td', t => t.map(s => s.textContent));

        assert.equal(tableContent[0], title);
        assert.equal(tableContent[1], author);
    });

    it('test creation of a book', async () => {
        await page.goto(host);

        //Test if we can submit an empty form
        page.on('dialog', async dialog => {
            if (dialog.type() == 'alert') {
                assert.equal(dialog.message(), 'All fields are required!');
                await dialog.accept();
            } else if (dialog.type() == 'confirm') {
                await dialog.accept();
            }
        });

        await page.waitForSelector('#createForm');

        await page.click('#createForm button');

        let bookTitle = 'Test book';
        let bookAuthor = 'User';

        //Create book
        await page.fill('input[name="title"]', bookTitle);
        await page.fill('input[name="author"]', bookAuthor);

        let [createRequest] = await Promise.all([
            page.waitForRequest(request => request.url() === 'http://localhost:3030/jsonstore/collections/books' && request.method() === 'POST'),
            page.click('#createForm button')
        ]);

        let response = await createRequest.response();

        assert.equal(response.status(), 200);
        assert.deepEqual(createRequest.postDataJSON(), { title: bookTitle, author: bookAuthor });
    });

    it('test book delete', async () => {
        await page.goto(host);
        
        let [loadResponse] = await Promise.all([
            page.waitForResponse('http://localhost:3030/jsonstore/collections/books'),
            page.click('text=load all books'),
        ]);
        
        let books = await loadResponse.json();

        let ids = [];

        Object.entries(books).map(([id, book]) => ids.push(id));
        
        page.on('dialog', async dialog => {
            dialog.accept();
        });
        
        const [deleteResponse] = await Promise.all([
            page.waitForResponse('http://localhost:3030/jsonstore/collections/books/' + ids[0]),
            page.click('text=delete')
        ]);
        
        let status = deleteResponse.status();
        
        assert.equal(status, 200);
    });
});