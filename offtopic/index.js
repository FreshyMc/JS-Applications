const { chromium } = require('playwright-chromium');
const fs = require('fs');

const logFile = './test.txt';

async function main(){
    const browser = await chromium.launch();

    const page = await browser.newPage();

    await page.goto('https://www.cars.bg');
    await page.waitForLoadState('domcontentloaded');

    const carImages = await page.$$eval('#listContainer .mdc-card__media', (elements) => {
        return elements.map(el => {
            let [, url] = el.style.backgroundImage.match(/url\("(.*)"\)/);

            return url;
        });
    });


    await browser.close();

    try{
        writeFile(carImages);
    }catch(err){
        console.log(err);
    }
    /*
    await page.click('span.text-label:text("Марка")');

    const carMakes = await page.$$eval('#brandsList > label:nth-child(n + 2) label', (brands)=>{
        return brands.map(brand => brand.textContent.trim());
    });

    try{
        writeFile(carMakes);
    }catch(err){
        console.log(err);
    }
    */
}

main();

function writeFile(content){
    let body = JSON.stringify(content);

    fs.writeFile(logFile, body, err => {
        if(err) throw err;

        console.log('Saved');
    });
}