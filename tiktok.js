const { chromium } = require('playwright');
const { randomDelay } = require('./delay');
const { getRandomComment } = require('./comment');

class TikTokAutomation {
  async init() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async collectVideoUrls(tag, max) {
    await this.page.goto(`https://www.tiktok.com/tag/${tag}`);
    await randomDelay(4000, 7000);

    const vids = new Set();
    for (let i = 0; i < 10 && vids.size < max; i++) {
      const urls = await this.page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href*="/video/"]')).map(a => a.href)
      );
      urls.forEach(u => vids.add(u));
      await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await randomDelay(2000, 4000);
    }
    return Array.from(vids).slice(0, max);
  }

  async commentOnVideo(url, text) {
    await this.page.goto(url);
    await randomDelay(3000, 5000);
    try {
      await this.page.fill('textarea', getRandomComment(text));
      await this.page.keyboard.press('Enter');
      return true;
    } catch {
      return false;
    }
  }

  async close() {
    await this.browser.close();
  }
}
module.exports = { TikTokAutomation };
