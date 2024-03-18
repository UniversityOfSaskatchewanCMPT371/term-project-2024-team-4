// @ts-check
const { test, expect} = require('@playwright/test');
/**
 * This file will host our smoke tests to ensure that
 * the main functionality of the system works.
 * Main Functionality is based off our Features (Requirements Specs)
 */

/*
Test that you can succesfully go to page with proper title (e.g. page exists)
*/
test('has title', async ({ page }) => {
    await page.goto('http://localhost:8080');
  
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
    test('Login with edge cases', async ({ page }) => {
        await page.goto("http://localhost:8080");

        const loginButton = page.locator('text=Login');
        await expect(loginButton).toBeVisible();
        await loginButton.click();

        // Edge cases: empty username, empty password
        const edgeCases = [
            { username: '', password: 'admin' },
            { username: 'admin', password: '' }
        ];

        for (const edgeCase of edgeCases) {
            await page.fill('input[name="username"]', edgeCase.username);
            await page.fill('input[name="password"]', edgeCase.password);

            await page.waitForLoadState('networkidle')

            const [response] = await Promise.all([
                page.waitForResponse(resp => resp.url().includes('/users') && resp.request().method() == "POST"),
                await page.locator("[type=submit]").click()
            ]);

            try {
                const responseStatus = response.status();

                // Expecting 400 Bad Request for edge cases
                await expect(responseStatus).toBe(400);
            } catch (error) {
                console.error("Error parsing response JSON", error);
            }
        }
    })
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
Data Aggregation
*/

/*
Search/Filter
*/