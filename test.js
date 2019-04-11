const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
 
  // 获取视窗信息 page.evaluate要获取打开的网页中的宿主环境
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });
  console.log('视窗信息:', dimensions);

  await page.goto('https://test.shopee.cn/', {
    waitUntil: 'networkidle2' // 等待网络状态为空闲的时候才继续执行
  });
  await page.screenshot({ path: 'shopeecn.png' });

  // 获取 html
  // 获取上下文句柄
  const htmlHandle = await page.$('html');

  // 执行计算
  const html = await page.evaluate(body => body.outerHTML, htmlHandle);

  // 销毁句柄
  await htmlHandle.dispose();

  console.log('html:', html);

  // 关闭浏览器
  // await browser.close();
})();