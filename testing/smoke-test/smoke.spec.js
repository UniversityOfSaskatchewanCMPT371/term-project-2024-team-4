// @ts-check
const { test, expect } = require("@playwright/test");
/**
 * This file will host our smoke tests to ensure that
 * the main functionality of the system works.
 * Main Functionality is based off our Features (Requirements Specs)
 */

/*
Test that you can succesfully go to page with proper title (e.g. page exists)
*/
test("has title", async ({ page }) => {
	await page.goto("http://localhost:8080");

	// Expect the correct title
	await expect(page).toHaveTitle("Vite + React");
});

/*
Admin Login
    - Invalid Credentials: cannot login
        - Test admin-only endpoint before login
    - Valid Credentials: can log in
        - Test admin-only endpoint after login
*/
test.describe("Login Smoke Tests", () => {
	// Test edge cases for login process
	test("Login with edge cases", async ({ page }) => {
		await page.goto("http://localhost:8080");

		const loginButton = page.locator("text=Login");
		await expect(loginButton).toBeVisible();
		await loginButton.click();

		// Edge cases: empty username, empty password
		const edgeCases = [
			{ username: "", password: "admin" },
			{ username: "admin", password: "" },
		];

		for (const edgeCase of edgeCases) {
			await page.fill('input[name="username"]', edgeCase.username);
			await page.fill('input[name="password"]', edgeCase.password);

			await page.waitForLoadState("networkidle");

            const [response] = await Promise.all([
                page.waitForResponse(resp => resp.url().includes('/users') && resp.request().method() == "POST"),
                await page.locator('button[type="submit"]:has-text("Login")').click()
            ]);

			try {
				const responseStatus = response.status();

				// Expecting 400 Bad Request for edge cases
				await expect(responseStatus).toBe(400);
			} catch (error) {
				console.error("Error parsing response JSON", error);
			}
		}
	});
});

/*
Catalog Management
    - Can add new artifact
    - Can modify the artifact
    - Can delete the artifact
*/

/*
Import/Export
*/

/*
Aggregate Statistics
    - Can get to the Page
    - Can open generate statisitics 
    - Can close generate statistics
*/
test.describe("Aggregate Statisitics Tests", () => {
	//NOTE: The button to get to the stats page is non funcitonal, uncomment this once its implemented.
	// test("Get to the Statistics Page from the home page.", async ({ page }) => {
	// 	await page.goto("http://localhost:8080/");

	// 	const statisticsButton = page.locator("text=Statistics");
	// 	await expect(statisticsButton).toBeVisible();
	// 	await statisticsButton.click();

	// 	await expect(page).toHaveURL("http://localhost:8080/stats");
	// });

	test("Get to the statistics modal from the statistics page.", async ({
		page,
	}) => {
		await page.goto("http://localhost:8080/stats");

		const generateButton = page.locator("text=GENERATE STATISTICS");
		await expect(generateButton).toBeVisible();
		await generateButton.click();

		const modalWindow = await page.getByRole("dialog", { name: "Statistics" });
		await expect(modalWindow).toBeVisible();
	});

	test("Can close generate statistics modal", async ({ page }) => {
		await page.goto("http://localhost:8080/stats");

		const generateButton = page.locator("text=GENERATE STATISTICS");
		await expect(generateButton).toBeVisible();
		await generateButton.click();

		const closeButton = page.locator("text=CLOSE");
		await expect(closeButton).toBeVisible();
		await closeButton.click();

		const modalWindow = await page.getByRole("dialog", { name: "Statistics" });
		await expect(modalWindow).toBeHidden();
	});
});

/*
Search/Filter
*/
