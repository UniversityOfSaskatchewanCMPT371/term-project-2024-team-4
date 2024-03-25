const { test, expect } = require("@playwright/test");

/**
 * Tests to Run
 *
 * Post man will be sued to add the data before the tests are run.
 *
 * Catalogue Data Tests:
 * 		- On a catalogue with no data.
 * 		- On a catalogue that doesn't exist
 * 		- On a catalogue with one site and no points
 * 		- On a catalogue with one site and one point
 *
 * Site Data Tests:
 * 		- On a site with no data.
 * 		- On a site that doesn't exist
 * 		- On a site one point
 * 		- On a site two points
 * 		- On a site with two points each
 *
 * Point Type Data Tests:
 * 		- On a Point Type with no data.
 * 		- On a Point Type that doesn't exist.
 * 		- On a Point Type with one material and no points
 * 		- On a Point Type with no materials and one point
 * 		- On a Point Type with one material and one point
 */

/**
 * THESE TESTS ARE UNDER THE IMPRESSION THAT TEST DATA HAS BEEN ADDED TO THE DATABASE PRIOR TO RUNNING
 */

/**
 * Just an example test to see how running a test works.
 */

/**
 * Catalogue Data Tests:
 * 		- On a catalogue with no data.
 * 		- On a catalogue that doesn't exist
 * 		- On a catalogue with one site and one point
 */
test.describe("Catalogue data tests", () => {
	test("On a catalogue with no data", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");

		const generateButton = page.locator("text=GENERATE STATISTICS");
		await expect(generateButton).toBeVisible();
		await generateButton.click();
	});
	test("On a catalogue that doesn't exist", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");

		const generateButton = page.locator("text=GENERATE STATISTICS");
		await expect(generateButton).toBeVisible();
		await generateButton.click();
	});
	test("On a catalogue with one site and one point", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");

		await expect(page.locator("text=Test Site")).toBeVisible();
		await expect(page.locator("text=Test Point 1 Location")).toBeVisible();
		await expect(page.locator("text=Test Blade Shape")).toBeVisible();
		await expect(page.locator("text=Test Base Shape")).toBeVisible();
		await expect(page.locator("text=Test Hafting Shape")).toBeVisible();
		await expect(page.locator("text=Test Cross Section")).toBeVisible();
		//Pie Chart Tests will have to be manual.
	});
});

/**
 * Site Data Tests:
 * 		- On a site with no data.
 * 		- On a site that doesn't exist
 * 		- On a site one point
 * 		- On a site two points
 * 		- On two site with two points each
 *
 * NOTE: Site data statistics is non function in the frontend
 */
test.describe("Site data tests", () => {
	test("On a site with no data.", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
	test("On a site that doesn't exist", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
	test("On a site one point", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
	test("On a site two points", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
	test("On two sites with two points each", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
});

/**
 * Point Type Data Tests:
 * 		- On a Point Type with no data.
 * 		- On a Point Type that doesn't exist.
 * 		- On a Point Type with one material and no points
 * 		- On a Point Type with no materials and one point
 * 		- On a Point Type with one material and one point
 *
 * NOTE: Point Type data statistics is non function in the frontend
 */
test.describe("Point Type data tests", () => {
	test("On a Point Type with no data.", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
	test("On a Point Type that doesn't exist.", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
	test("On a Point Type with one material and no points", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
	test("On a Point Type with no materials and one point", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
	test("On a Point Type with one material and one point", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");
	});
});
