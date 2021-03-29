it('edit book', async () => {
            await page.goto(host);
            //LOAD ALL BOOKS AND CLICK ON THE FIRST EDIT BUTTON
            await page.click('text=load all books');         
            await page.click('text=edit');      
            //CHANGE TITLE AND AUTHOR   
            await page.fill('#editForm >> css=[name="title"]', "TestTitle");         
            await page.fill('#editForm >> css=[name="author"]', "TestAuthor");
            //SAVE AND LOAD ALL BOOKS AGAIN
            await page.click('text=save');  
            await page.click('text=load all books');  
            //GET TABLE CONTENT
            let tableContent =  await page.$$eval('td',  t => t.map(s => s.textContent));
            //CHECK IF THE FIRST ROW IS CHANGED
            expect(tableContent[0]).to.equal("TestTitle");
            expect(tableContent[1]).to.equal("TestAuthor");
        });
        it('delete book', async () => {
            await page.goto(host);
            //LOAD ALL BOOKS AND CLICK ON THE FIRST DELETE BUTTON
            const [loadResponse] = await Promise.all([
                page.waitForResponse('http://localhost:3030/jsonstore/collections/books'),
                page.click('text=load all books'),
              ]);
            //GET THE FIRST BOOK ID
            let books = await loadResponse.json();
            let ids = [];
            Object.entries(books).map(getId);
            function getId([id, book]){
                ids.push(id);
            }
           // ACCEPT ANY FUTURE DIALOG MESSAGES
            page.on('dialog', async dialog => {
                dialog.accept();
            });
            // DELETE THE FIRST BOOK
            const [deleteResponse] = await Promise.all([
                page.waitForResponse('http://localhost:3030/jsonstore/collections/books/'+ ids[0]),
                page.click('text=delete')
            ]);
            // GET THE STATUS OF THE DELETE REQUEST
            let status = deleteResponse.status();
            // EXPECT THE STATUS TO BE 200
            expect(status).to.equal(200);
        });