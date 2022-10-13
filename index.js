const puppeteer = require("puppeteer-extra");
// add stealthplugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
const port = 3000;
app.use(cors());

app.get("/regocheck", (req, res) => {
  puppeteer
    .launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    .then(async (browser) => {
      console.log("Running tests..");
      const page = await browser.newPage();
      await page.goto("https://www.redbook.com.au/");
      // await page.waitForTimeout(5000);
      const makeButton = await page.$x("//div[@id='search-field-make']");

      await makeButton[0].click();

      var makeList = await page.$x("//div[@class='dropdown-item']");

      const makes = await page.evaluate(() => {
        const elements = document.querySelectorAll(".dropdown-item");
        console.log(elements);
        // do something with elements, like mapping elements to an attribute:
        return Array.from(elements).map((element) => element.textContent);
      });

      var brands = [];

      for (var i = 0; i < makeList.length; i++) {
        await makeList[i].click();

        await page.waitForTimeout(200);

        const modelButton = await page.$x("//div[@id='search-field-model']");

        await modelButton[0].click();

        const result = await page.evaluate(() => {
          const elements = document.querySelectorAll(".dropdown-item");

          
          return Array.from(elements).map((element) => element.textContent);
        });

        // res.send(result);

        await page.waitForTimeout(200);

        brands.push({ make: makes[14 + i], models: result });

        await page.waitForTimeout(200);

        const makeButton = await page.$x("//div[@id='search-field-make']");
        await makeButton[0].click();
        makeList = await page.$x("//div[@class='dropdown-item']");
        // console.log(makeList);

        console.log(i);

        await page.waitForTimeout(400);
      }

      res.send(brands);

      await page.waitForTimeout(50000);

      await page.screenshot({ path: "testresult.png", fullPage: true });
      await browser.close();
      console.log(`All done, check the screenshot. ✨`);

      // res.send(result);
    });
});

app.listen(process.env.PORT || port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);

// puppeteer usage as normal
