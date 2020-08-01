const puppeteer = require('puppeteer');
const server = require('../testbed/server');

// const APP = `http://localhost:${process.env.PORT || 2022}/`;
const APP = `http://localhost:2022/`;
// const APP = server;

describe('Front-end Integration/Features', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(() => {
    browser.close();
  });

  // simulate button click Producer
  const buttonProducer = async () => {
    await page.waitForSelector('#message-num');
    await page.focus('#message-num');
    await page.keyboard.type('1');
    await page.waitForSelector('#produce-button');
    await page.click('#produce-button');
  };

  describe('Initial display', () => {
    it('loads successfully', async () => {
      // We navigate to the page at the beginning of each case so we have a
      // fresh start
      await page.goto(APP);
      await page.waitForSelector('#header');
      const title = await page.$eval('#header', (el) => el.innerHTML);
      expect(title).toBe('Select Option To Generate Data');
    });

    // checkes Input field of Producer
    it('displays a usable input field for Producer', async () => {
      await page.waitForSelector('#message-num');
      await page.focus('#message-num');
      await page.keyboard.type('100');
      const inputValue = await page.$eval('#message-num', (el) => el.value);
      expect(inputValue).toBe('100');
    });

    // checkes Input field of Consumer
    it('displays a usable input field for Consumer', async () => {
      await page.waitForSelector('#consume-input');
      await page.focus('#consume-input');
      await page.keyboard.type('100');
      const inputValue = await page.$eval('#consume-input', (el) => el.value);
      expect(inputValue).toBe('100');
    });

    // // Simulate button click and run msg Producer
    // it('renders the Producer MSG section reciver is socket.io', async () => {
    //   await buttonProducer();

    // });
  });
});
