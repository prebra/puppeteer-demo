const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const config = require('../config/spider.config');
const saveDir = path.join(__dirname, '../csv');
const error = chalk.bold.red;
const success = chalk.bold.green;

function checkSaveDir() {
  try {
    fs.readdirSync(saveDir);
  } catch (e) {
    fs.mkdirSync(saveDir);
  }
}

async function spiderInit() {
  try {
    const browser = await puppeteer.launch();
    const skuLinks = await getSkuLinks(browser);
    const skuInfos = await getSukInfo(browser, skuLinks);
    await browser.close();
    genCsvData(skuInfos);
  } catch(err) {
    console.log(error(err));
  }
}

async function getSkuLinks(browser) {
  try {
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 3000 });
    await page.goto(config.url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.shopee-search-item-result__item');
  
    const skuLinks = await page.evaluate(selector => {
      let list = Array.from(document.querySelectorAll(selector));
      return list.map(i => i.href);
    }, '.shopee-search-item-result__item a');
    return skuLinks;
  } catch(err) {
    console.log(error('获取sku链接失败', err));
  }
}

async function getSukInfo(browser, skuLinks) {
  let skuInfos = [];
  for(link of skuLinks.slice(0, 2)) {
    console.log(`开始获取${decodeURIComponent(link)}数据`);
    let skuInfo = {};

    const page = await browser.newPage();
    try {
      await page.setRequestInterception(true);
      page.on('request', interceptedRequest => {
        if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
          interceptedRequest.abort();
        else
          interceptedRequest.continue();
      });
      await page.goto(link, { waitUntil: 'networkidle2' });
      await page.waitForSelector('.page-product__content');

      let html = await page.content();
      const $ = cheerio.load(html);

      config.skuContentArr.forEach(item => {
        skuInfo[item.name] = item(link, $);
      });
      await page.close();
      console.log(success('获取sku数据成功'));
      skuInfos.push(skuInfo);
    } catch(err) {
      console.log(error('获取sku数据失败', err));
      await page.close();
    }
  };
  return skuInfos;
}

function genCsvData(data) {
  try {
    const json2csvParser = new Parser({ fields: config.fields });
    const csv = json2csvParser.parse(data);
    const now = new Date();
    const nowStr = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    
    checkSaveDir();
    const fileName = path.resolve(`${saveDir}/${nowStr}.csv`);

    saveCsv(fileName, csv);
    console.log(success(`> 成功生成 ${fileName} ！`));
  } catch(err) {
    console.log(error(err));
  }
}

function saveCsv(fileName, content) {
  // 防止excel打开乱码: https://github.com/f2e-journey/xueqianban/issues/34
  const msExcelBuffer = Buffer.concat([
    Buffer.from('\xEF\xBB\xBF', 'binary'),
    Buffer.from(content)
  ]);
  fs.writeFileSync(fileName, msExcelBuffer);
}
module.exports = spiderInit;