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

    // test to determine proper response HTTP status codes upon login attempt
    test('Login process with failure and success scenarios', async ({ page }) => {
        // Navigate to login page
        await page.goto("http://localhost:8080");

        // Find and press Login Button
        const loginButton = page.locator('text=Login');
        await expect(loginButton).toBeVisible();
        await loginButton.click();

        // Define credentials for testing 
        // TC01 to TC08
        const credentials = [
            { username: 'admin123#.;', password: "admin"},
            { username: 'ADMIN', password: "admin"},
            { username: 'admin', password: "admin123#.;"},
            { username: 'admin', password: "ADMIN"},
            { username: '', password: ""},
            { username: 'admin', password: ""},
            { username: '', password: "admin"},
            { username: 'admin', password: "admin"},

        ];

        // Use credentials to attempt login
        for (const credential of credentials) {

            // Fill the inputs
            await page.fill('input[name="username"]', credential.username);
            await page.fill('input[name="password"]', credential.password);

            await page.waitForLoadState('networkidle')

            // Submit login 
            var [response] = await Promise.all([
                page.waitForResponse(resp => resp.url().includes('/users') && resp.request().method() == "POST"),
                await page.locator("[type=submit]").click()
            ]);
            
            // Expect the right response
            try {
                var responseStatus = response.status();

                if (credential.username === 'admin' && credential.password === 'admin'){
                    // expect succesful response
                    await expect(responseStatus).toBe(200);
                }
                else{
                    await expect([400,401]).toContain(responseStatus);
                }
            }
            catch (error){
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