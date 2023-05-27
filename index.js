const puppeteer = require('puppeteer-core');
const fs = require('fs')
async function run(){
  let browser;
  try {
    const auth = 'brd-customer-hl_7fc34b15-zone-zone1:20pknl3f11ty'
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`
    })
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2*60*1000)
    await page.goto('https://openlibrary.org/works/OL100000W.json')

    const book = await page.evaluate(()=>{
      const preEl = document.querySelector('pre')
      return preEl.textContent;
    })
    fs.writeFileSync('library.txt',`${book}`)
    console.log(book)
  } catch (e) {
    console.error('builder failed', e);
  }finally{
    await browser?.close();
  }
}
run()