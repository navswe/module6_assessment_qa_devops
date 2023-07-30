const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

// afterEach(async () => {
//   driver.quit();
// });

describe("Duel Duo tests", () => {
  // test to check page title
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });
  // test to check that clicking the Draw button displays the div with id='choices'
  test("Draw button clicks to display choices", async () => {
    await driver.get("http://localhost:8000");
    // not necessary for this test, I added this line so I can see the page finish loading
    await driver.wait(until.titleIs("Duel Duo"), 5000);
    await driver.findElement(By.id("draw")).click();
    await driver.wait(until.elementLocated(By.id("choices")), 5000);
  });

  // test to check that clicking an 'Add to Duo' button displays the div with id='player-duo'
  test('"Add to Duo" button displays the 2 choices', async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 5000);
    await driver.findElement(By.id("draw")).click();
    await driver.findElement(By.className("bot-btn")).click();
    await driver.wait(until.elementLocated(By.id("player-duo")), 5000);
  });
});
