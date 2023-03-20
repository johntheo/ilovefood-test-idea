const functions = require("firebase-functions");
const playwright = require("playwright");

exports.scrapePage = functions.https.onRequest(async (req, res) => {
  const url = req.query.url;

  const browser = await playwright.chromium.launch({headless: true});
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
