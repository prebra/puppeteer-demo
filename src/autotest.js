const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

let sourceDir = path.join(__dirname, '../auto-test');
let sucSourceDir = path.join(sourceDir, 'success');
let errSourceDir = path.join(sourceDir, 'error');

function checkSourceDir(sourceDir) {
  try {
    fs.readdirSync(sourceDir)
  } catch (e) {
    fs.mkdirSync(sourceDir)
  }
}

async function openPage() {
  try {
    const browser = await puppeteer.launch({
      devtools: true,
      headless: false
    });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('https://test.shopee.cn/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.container');
    return {browser, page};
  } catch(e) {
    console.log(e);
  }
}

describe('测试shopeecn', function() {
  describe('测试shopeecn卖家入驻', function() {
    before(async function() {
      checkSourceDir(sourceDir);
      let { browser, page } = await openPage();
      this.browser = browser;
      this.page = page;
    });

    after(async function() {
      await this.browser.close();
    });

    it('从首页头部进入卖家入驻', async function() {
      let page = this.page;
      try {
        let menuBtn = await page.$('.header-item .icon-menu');
        // 判断头部按钮是否存在
        expect(menuBtn).to.be.exist;
        await menuBtn.tap();
        await page.waitFor(2000);

        let enterBtn = await page.$('.header-nav-wrap .enter-btn');
        // 判断立即入驻按钮是否存在
        expect(enterBtn).to.be.exist;
        await enterBtn.tap();
        await page.waitForSelector('.seller-wrap');

        checkSourceDir(sucSourceDir);
        await page.screenshot({
          path: `${sucSourceDir}/homeToSeller.png`,
          fullPage: true
        });
      } catch(e) {
        checkSourceDir(errSourceDir);
        await page.screenshot({
          path: `${errSourceDir}/homeToSeller.png`,
          fullPage: true
        });
        throw e;
      }
    });
    it('入驻表单提交测试', async function() {
      let page = this.page;
      try {
        let nameInput = await page.$('.shopee-form-item[data-field="user_name"] input');
        let phoneInput = await page.$('.shopee-form-item[data-field="user_phone"] input');
        let emailInput = await page.$('.shopee-form-item[data-field="user_email"] input');
        let qqInput = await page.$('.shopee-form-item[data-field="user_qq"] input');
        let companyNameInput = await page.$('.shopee-form-item[data-field="company_name"] input');
        let addressInput = await page.$$('.shopee-form-item[data-field="company_address"] input');
        let employeeInput = await page.$('.shopee-form-item[data-field="employee_cnt_type"] .shopee-radio-button');
        let licenseIdInput = await page.$('.shopee-form-item[data-field="license_id"] input');
        let productCatIdInput = await page.$('.shopee-form-item[data-field="product_cat_id"] .shopee-radio-button');
        let listingCntTypeInput = await page.$('.shopee-form-item[data-field="listing_cnt_type"] .shopee-radio-button');
        let platformInput = await page.$('.shopee-form-item[data-field="platform_ids"] .shopee-checkbox-button');

        // 判断联系人输入框是否存在
        expect(nameInput).to.be.exist;
        await nameInput.type('zhy', {
          delay: 100 // 控制 keypress 也就是每个字母输入的间隔
        });

        // 判断手机输入框是否存在
        expect(phoneInput).to.be.exist;
        await phoneInput.type('18575540000', {
          delay: 100
        });

        // 判断邮箱输入框是否存在
        expect(emailInput).to.be.exist;
        await emailInput.type('1857554@163.com', {
          delay: 100
        });

        // 判断QQ输入框是否存在
        expect(qqInput).to.be.exist;
        await qqInput.type('185755400', {
          delay: 100
        });

        // 判断公司名称输入框是否存在
        expect(companyNameInput).to.be.exist;
        await companyNameInput.type('虾皮有限公司', {
          delay: 100
        });

        // 判断公司地址输入框是否存在
        expect(addressInput[0]).to.be.exist;
        await addressInput[0].tap();
        await page.waitFor(1000);

        // 选择省份
        let [province] = await page.evaluate(selector => {
          let li = document.querySelectorAll(selector)[1].querySelectorAll('li')[4];
          li.click();
          return [li.innerText];
        }, '.shopee-popper .shopee-select__menu');
        expect(province).to.be.a('string');

        // 选择市
        await addressInput[1].tap();
        await page.waitFor(1000);
        let [town] = await page.evaluate(selector => {
          let li = document.querySelectorAll(selector)[1].querySelectorAll('li')[5];
          li.click();
          return [li.innerText];
        }, '.shopee-popper .shopee-select__menu');
        expect(town).to.be.a('string');

        // 判断员工总数是否存在
        expect(employeeInput).to.be.exist;
        await employeeInput.tap();

        // 判断营业执照编号输入框是否存在
        expect(licenseIdInput).to.be.exist;
        await licenseIdInput.type('12345', {
          delay: 100
        });

        // 判断主要品类是否存在
        expect(productCatIdInput).to.be.exist;
        await productCatIdInput.tap();

        // 判断listing总数是否存在
        expect(listingCntTypeInput).to.be.exist;
        await listingCntTypeInput.click();

        // 判断其他经营平台总数是否存在
        expect(platformInput).to.be.exist;
        await platformInput.click();

        let confirmBtn = await page.$('.formboxbot .shopee-button');
        expect(confirmBtn).to.be.exist;
        await confirmBtn.click();

        await page.waitFor(1000);

        await page.screenshot({
          path: `${sucSourceDir}/sellerFormSubmit.png`,
          fullPage: true
        });
      } catch (e) {
        checkSourceDir(errSourceDir);
        await page.screenshot({
          path: `${errSourceDir}/sellerFormSubmit.png`,
          fullPage: true
        });
        throw e;
      }
    })
  })
})