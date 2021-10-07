import puppeteer from 'puppeteer'
import cher from 'cherio'

export const LAUNCH_PUPPETEER_OPTS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=800x600'
  ]
};

export const PAGE_PUPPETEER_OPTS = {
  networkIdle2Timeout: 5000,
  waitUntil: 'networkidle2',
  timeout: 3000000
};

export class PuppeteerHandler {
  constructor() {
    this.browser = null;
  }
  async initBrowser() {
    this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
  }
  closeBrowser() {
    this.browser.close();
  }
  async getPageContent(url) {
    if (!this.browser) {
      await this.initBrowser();
    }

    try {
      const page = await this.browser.newPage();
      await page.goto(url, PAGE_PUPPETEER_OPTS);
      return await page.content();
    } catch (err) {
      throw err;
    }
  }

  async getDataFromPage(url) {
    if (!this.browser) {
      await this.initBrowser();
    }

    try {
      const page = await this.browser.newPage()
      await page.goto(url, PAGE_PUPPETEER_OPTS)
      let data = []
      let elements = await page.$$('span.link')
      let con = await page.content()
      let $ = cher.load(con)
      let region = $('h3.text-center').text()
      let count = 0
      for (const element of elements) {
        const newPage = await this.browser.newPage()
        await newPage.goto(url, PAGE_PUPPETEER_OPTS)
        let el = await newPage.$$('span.link')
        await el[count].click()
        await newPage.waitForSelector('.vote-buttons b')
        con = await newPage.content()
        $ = cher.load(con)
        data.push({region: region, title: $('.work-details.article h3').text(), score: $('.vote-buttons b').text()})
        await newPage.close()
        count++
      }
      return data
    } catch (err) {
      throw err
    }
  }
}
