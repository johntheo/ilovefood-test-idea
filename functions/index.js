/* eslint-disable quotes */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const {chromium} = require("playwright");
const bundledChromium = require("chrome-aws-lambda");

exports.helloScrape = functions.runWith({timeoutSeconds: 300, memory: "1GB"})
    .https.onRequest(async (req, res) => {
      const url = req.query.url;

      console.log("Scrapping ===> ", url);
      const browser = await Promise.resolve(bundledChromium.executablePath)
          .then(
              (executablePath) => {
                if (!executablePath) {
                  // local execution
                  return chromium.launch({
                    headless: false,
                  });
                }
                return chromium.launch({executablePath, headless: false});
              },
          );

      const page = await browser.newPage();
      await page.goto(url);

      const title = await page.title();

      await browser.close();

      res.status(200).send({title});
    });


exports.scrapePage = functions.runWith({timeoutSeconds: 300, memory: "1GB"})
    .https.onRequest(async (req, res) => {
      const url = req.query.url;

      console.log("Scrapping ===> ", url);
      const browser = await Promise.resolve(bundledChromium.executablePath)
          .then(
              (executablePath) => {
                if (!executablePath) {
                  // local execution
                  return chromium.launch({
                    headless: false,
                  });
                }
                return chromium.launch({executablePath, headless: false});
              },
          );

      const page = await browser.newPage();
      await page.goto(url);

      const title = await page.title();
      const promotions = [];
      const priceRegex = /\d+(?:,\d+)?/g;

      await page.waitForSelector('[data-test-id="restaurant-menu-group__promotion"]');
      const promoList = await page.locator('[data-test-id="restaurant-menu-group__promotion"]').getByRole('link').all();
      console.log("List size = ", promoList.length);

      for (const li of promoList ) {
        await li.click();

        const price = await page.locator("[data-test-id=\"dish-content-discount-price\"]").innerText();
        const promotion = {
          name: await await page.getByRole("banner").innerText(),
          details: await page.locator("[data-test-id=\"dish-content__details\"]").innerText(),
          priceNew: price.match(priceRegex)[0],
          priceOld: price.match(priceRegex)[1],
          url: page.url(),
        };

        promotions.push(promotion);
        await page.getByRole('button', {name: 'Fechar'}).click();
      }
      await browser.close();

      res.status(200).send({title, promotions});
    });

