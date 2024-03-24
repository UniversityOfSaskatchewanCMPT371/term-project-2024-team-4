const puppeteer = require("puppeteer");

describe("Login Integration Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Login Test with success", async () => {
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "admin");
    await page.type('input[name="password"]', "admin");
    // Submit login
    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect(responseStatus).toBe(200);
  });
});

describe("Empty username input tests With :", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("empty password", async () => {
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "");
    await page.type('input[name="password"]', "");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("Correct password", async () => {
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "");
    await page.type('input[name="password"]', "admin");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("Incorrect password", async () => {
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "");
    await page.type('input[name="password"]', "xyzzzz");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });
});

describe("Empty password input tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("empty username ", async () => {
    //here we do test for empty username with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "");
    await page.type('input[name="password"]', "");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("Correct username ", async () => {
    //here we do test for correct password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "admin");
    await page.type('input[name="password"]', "");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("incorrect username ", async () => {
    //here we do test for incorrect password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "invalid_user");
    await page.type('input[name="password"]', "");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });
});

describe("correct username input tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("incorrect password ", async () => {
    //here we do test for incorrect password with empty password
    await page.goto("http://localhost:8080");

    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "admin");
    await page.type('input[name="password"]', "wrong");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([401]).toContain(responseStatus);
  });

  test("empty password ", async () => {
    //here we do test for empty username with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "admin");
    await page.type('input[name="password"]', "");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("Correct password ", async () => {
    //here we do test for correct password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "admin");
    await page.type('input[name="password"]', "admin");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([200]).toContain(responseStatus);
  });
});

describe("Correct password input tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("incorrect username ", async () => {
    //here we do test for correct password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "wrong");
    await page.type('input[name="password"]', "admin");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([401]).toContain(responseStatus);
  });

  test("empty username ", async () => {
    //here we do test for empty username with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "");
    await page.type('input[name="password"]', "admin");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("Correct username ", async () => {
    //here we do test for correct password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "admin");
    await page.type('input[name="password"]', "admin");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([200]).toContain(responseStatus);
  });
});

describe("InCorrect password input tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("empty username ", async () => {
    //here we do test for empty username with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "");
    await page.type('input[name="password"]', "invalid_password");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("Correct username ", async () => {
    //here we do test for correct password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "admin");
    await page.type('input[name="password"]', "invalid_password");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });
  test("incorrect username ", async () => {
    //here we do test for incorrect password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "invalid_username");
    await page.type('input[name="password"]', "invalid_password");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });
});
describe("Incorrect username input tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("empty password ", async () => {
    //here we do test for empty username with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "invalid_username");
    await page.type('input[name="password"]', "");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("Correct password ", async () => {
    //here we do test for correct password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "invalid_username");
    await page.type('input[name="password"]', "admin");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });
  test("incorrect password ", async () => {
    //here we do test for incorrect password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "invalid_username");
    await page.type('input[name="password"]', "invalid_password");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });
});

describe("Testin using long inputs ", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("300 letter username ", async () => {
    //here we do test for empty username with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type(
      'input[name="username"]',
      "invaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduser"
    );
    await page.type('input[name="password"]', "admin");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  }, 100000);

  test("300 letter password ", async () => {
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "admin");
    await page.type(
      'input[name="password"]',
      "invaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduser"
    );

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  }, 100000);

  test("Maximum length of username and password fields", async () => {
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "a".repeat(255)); // Max allowed characters for username
    await page.type('input[name="password"]', "b".repeat(255)); // Max allowed characters for password

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      page.locator("[type=submit]").click(),
    ]);
    const responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  }, 10000);
});

describe("Number inputs short and long input tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Short number inputs  ", async () => {
    //here we do test for empty username with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "5455656565656565656565");
    await page.type('input[name="password"]', "555555554998");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });

  test("Long number inputs", async () => {
    //here we do test for correct password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "5".repeat(100));
    await page.type('input[name="password"]', "5".repeat(200));

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });
  test("incorrect password ", async () => {
    //here we do test for incorrect password with empty password
    await page.goto("http://localhost:8080");
    await page.click("text=Login");
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="username"]', "invalid_username");
    await page.type('input[name="password"]', "invalid_password");

    var [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/users") && resp.request().method() == "POST"
      ),
      await page.locator("[type=submit]").click(),
    ]);
    var responseStatus = response.status();

    await expect([400, 401]).toContain(responseStatus);
  });
});
