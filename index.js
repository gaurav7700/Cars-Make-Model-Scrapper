const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal
puppeteer
  .launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  .then(async (browser) => {
    console.log("Running tests..");
    const page = await browser.newPage();
    await page.goto("https://www.redbook.com.au/");
    // await page.waitForTimeout(5000);
    const elements = await page.$x("//div[@id='search-field-make']");

    await elements[0].click();
    // await Promise.all([page.waitForNavigation(), await elements[0].click()]);dropdown-item ><div class="dropdown-item top-value" 
    //title="Audi">Audi</div>
    // const data = await page.evaluate(
    //   () => document.querySelector("*").outerHTML
    // );

    // console.log(data);
    
    const result = await page.evaluate(() => {
      const elements = document.querySelectorAll(".dropdown-item");
      console.log(elements)
      // do something with elements, like mapping elements to an attribute:
      return Array.from(elements).map((element) => element.textContent);
    });

    // console.log(result)

    await page.screenshot({ path: "testresult.png", fullPage: true });
    await browser.close();
    console.log(`All done, check the screenshot. ✨`);
  });
