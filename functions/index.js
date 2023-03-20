const functions = require("firebase-functions");
const {chromium} = require("playwright-core");
const bundledChromium = require("chrome-aws-lambda");

exports.scrapePage = functions.runWith({timeoutSeconds: 300, memory: "1GB"})
    .https.onRequest(async (req, res) => {
      const url = req.query.url;

      const browser = await Promise.resolve(bundledChromium.executablePath)
          .then(
              (executablePath) => {
                if (!executablePath) {
                  // local execution
                  return chromium.launch({});
                }
                return chromium.launch({executablePath});
              },
          );

      const page = await browser.newPage();
      await page.goto(url);

      const title = await page.title();
      const description = await page.$eval("meta[name=\"description\"]",
          (el) => el.content);
      const imageUrl = await page.$eval("meta[property=\"og:image\"]",
          (el) => el.content);

      await browser.close();

      res.status(200).send({title, description, imageUrl});
    });
