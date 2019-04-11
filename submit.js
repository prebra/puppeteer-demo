const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

const iPhone6 = devices['iPhone 6'];

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  // page.setViewport({ width: 1200, height: 736 });

  await page.emulate(iPhone6);

  await page.goto('https://test.shopee.cn/news', {
    waitUntil: 'networkidle2'
  });

  await page.tap('.icon-search-thick');
  await page.type('.input', 'shopee', {
    delay: 200, // 控制 keypress 也就是每个字母输入的间隔
  });
  await page.keyboard.press('Enter');
})()