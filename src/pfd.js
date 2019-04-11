const puppeteer = require('puppeteer');
const chalk = require('chalk');
const path = require('path');
const mkdirp = require('mkdirp');

const saveDir = path.join(__dirname, '../ryf-es6');
const url = 'http://es6.ruanyifeng.com/';

async function pdf() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 2400 });

    // networkidle2: consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('#sidebar');

    console.log('start collect directory...');

    const config = {
      outputPath: `${saveDir}/`,
      displayHeaderFooter: true
    }

    const articles = await page.evaluate(selector => {
      let list = Array.from(document.querySelectorAll(selector));
      return list.map(i => {
        return {
          href: i.href,
          title: i.innerText
        }
      })
    }, '#sidebar ol li a');

    mkdirp.sync(saveDir);
    for (let i = 0; i < articles.length; i++) {
      try {
        const article = articles[i];
        const articlePage = await browser.newPage();
        await articlePage.goto(article.href, { waitUntil: 'networkidle2' }).catch(e => console.log(e));
        await articlePage.waitForSelector('#content');
        await articlePage.$eval('body', body => {
          body.querySelector('#sidebar').style.display = 'none';
          Promise.resolve();
        });
        await articlePage.pdf({
          path: `${config.outputPath}/第${i + 1}章.${article.title}.pdf`,
          displayHeaderFooter: config.displayHeaderFooter,
          format: 'A4'
        });
        console.log(`保存成功: ${article.title}`);
        articlePage.close();
      } catch(e) {
        console.log(chalk.red('保存失败:', e));
      }
    }
    console.log('保存完成');
    await page.close();
  } catch(e) {
    console.error(e);
  }
};

module.exports = pdf;
