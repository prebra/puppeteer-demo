const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  await page.goto('https://www.google.com/', { waitUntil: 'networkidle2' });

  await page.waitForSelector('.a4bIc');
  await page.type('.a4bIc input', 'puppeteer', { delay: 100 });
  await page.keyboard.press('Enter');

  await page.waitFor(4000);

  await browser.close();
})()