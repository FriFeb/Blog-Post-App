const puppeteer = require('puppeteer');

describe('Record and play', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should register', async () => {
    await page.goto('http://localhost:8080/register');

    await page.waitForSelector('#username');

    await page.click('#username');
    await page.type('#username', '2');

    await page.click('#email');
    await page.type('#email', '2@2');

    await page.click('#password');
    await page.type('#password', '2323Aa');

    await page.click('#confirm');
    await page.type('#confirm', '2323Aa');

    await page.click('#register');
  });

  it('should perform login and create a new post', async () => {
    await page.goto('http://localhost:8080/login');
    await page.waitForSelector('#username');

    await page.click('#username');
    await page.type('#username', '2');

    await page.click('#password');
    await page.type('#password', '2323Aa');

    await page.click('#login');

    await page.waitForSelector('#add_new_post_btn');

    await page.click('#add_new_post_btn > button');

    await page.click('#title');
    await page.type('#title', 'New Post');

    await page.type('#description', 'Description');
    await page.type('#body', 'here we go');

    await page.click('#post');
    await page.waitForSelector('#profile');

    await page.click('#profile');

    const url = page.url();
    expect(url).toMatch(/\/(profile)/);
  });
});
