/* eslint-disable quotes */
/* eslint-disable max-len */
// @ts-nocheck
const {test} = require("@playwright/test");

test("has title", async ({page}) => {
  await page.goto("https://www.ifood.com.br/delivery/campo-largo-pr/abare-pizzarias-e-restaurante--cl-centro/c492dc09-04d1-4771-a85e-e66bce982f12");

  // Expect a title "to contain" a substring.
  const promotions = [];

  await page.waitForSelector('[data-test-id="restaurant-menu-group__promotion"]');
  const promoList = await page.locator('[data-test-id="restaurant-menu-group__promotion"]').getByRole('link').all();
  console.log("List size = ", promoList.length);

  for (const li of promoList ) {
    console.log(li);
    await li.click();

    console.log("NAME: ", await page.getByRole("banner").innerText());
    console.log("DETAILS: ", await page.locator("[data-test-id=\"dish-content__details\"]").innerText());
    console.log("PRICE: ", await page.locator("[data-test-id=\"dish-content-discount-price\"]").innerText());
    console.log("URL: ", page.url());
    const promotion = {
      name: await await page.getByRole("banner").innerText(),
      details: await page.locator("[data-test-id=\"dish-content__details\"]").innerText(),
      price: await page.locator("[data-test-id=\"dish-content-discount-price\"]").innerText(),
    };

    promotions.push(promotion);
    await page.getByRole('button', {name: 'Fechar'}).click();
  }
});
