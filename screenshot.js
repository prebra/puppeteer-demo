const puppeteer = require('puppeteer');

(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch();
  // 打开页面
  const page = await browser.newPage();
  // 设置浏览器视窗
  page.setViewport({ width: 1200, height: 1000});
  // 地址栏输入网页地址
  await page.goto('https://test.shopee.cn/', {
    waitUntil: 'networkidle2' // 等待网络状态为空闲的时候才继续执行
  });
  await page.screenshot({ path: 'shopeecn.png' });
  // 关闭浏览器
  await browser.close();
})();